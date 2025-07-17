require('dotenv').config();
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const EXPA_ACCESS_TOKEN = process.env.EXPA_API_KEY;
const GRAPHQL_ENDPOINT = process.env.EXPA_API_URL || 'https://gis-api.aiesec.org/graphql';

function generatePassword(full_name, applicationId) {
  const nameParts = full_name.trim().toLowerCase().split(' ');
  const first = nameParts[0]?.slice(0,2) || '';
  const last = nameParts[1]?.slice(0,2) || '';

  const appSuffix = String(applicationId).slice(-2);
  const randomDigits = Math.floor(100 + Math.random() * 9000).toString().slice(0, Math.floor(2 + Math.random()*3));

  const password = `${first}${last}${appSuffix}${randomDigits}`;
  return password;
}

async function fetchPage(page) {
  const query = `
    query {
      allOpportunityApplication(
        filters: { opportunity_home_lc: 270, created_at: { from: "2024-08-01T00:00:00Z", to: "2026-01-31T00:00:00Z" } },
        per_page: 1000,
        page: ${page}
      ) {
        data {
          id
          person {
            id
            full_name
            phone
            email
            home_lc { name }
            home_mc { name }
          }
          status
          slot {
            start_date
            end_date
          }
          opportunity {
            title
            programme { id }
            description
            company_description
            google_place_id
            organisation { name }
            logistics_info {
              accommodation_provided
              accommodation_covered
              transportation_provided
              transportation_covered
              food_provided
              food_covered
              computer_provided
              no_of_meals
            }
            specifics_info {
              salary
            }
            opportunity_duration_type {
              duration_type
            }
          }
        }
        paging {
          total_pages
        }
      }
    }
  `;

  const response = await axios.post(
    GRAPHQL_ENDPOINT,
    { query },
    {
      headers: {
        Authorization: `${EXPA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data.allOpportunityApplication;
}

async function fetchAllEPs() {
  const appSet = new Set();
  let results = [];
  let currentPage = 1;
  let totalPages = 1;

  // Load existing users to preserve their data
  let existingUsers = [];
  try {
    existingUsers = await fs.readJson(USERS_FILE);
  } catch (e) {
    existingUsers = [];
  }

  try {
    do {
      console.log(`📄 Fetching page ${currentPage}...`);
      const pageData = await fetchPage(currentPage);
      totalPages = pageData.paging.total_pages;

      const filtered = pageData.data.filter(app =>
        ['approved', 'realized'].includes(app.status)
      );

      filtered.forEach(app => {
        if (!appSet.has(app.id)) {
          appSet.add(app.id);
          // Check if EP already exists
          const existing = existingUsers.find(u => u.applicationId === app.id);
          if (existing) {
            results.push(existing); // Keep existing data
          } else {
            results.push({
              applicationId: app.id,
              epId: app.person.id,
              fullName: app.person.full_name,
              title: app.person.title || '',
              email: app.person.email || '',
              phone: app.person.phone || '',
              picture: "",
              role: 'EP',
              password: generatePassword(app.person.full_name, app.id),
              lc: app.person.home_lc?.name || 'Unknown',
              mc: app.person.home_mc?.name || 'Unknown',
              status: app.status,
              realized: false,
              startDate: app.slot?.start_date || null,
              endDate: app.slot?.end_date || null,
              opportunity: {
                programmeId: app.opportunity?.programme?.id || null,
                description: app.opportunity?.description || '',
                company: app.opportunity?.organisation?.name || '',
                placeId: app.opportunity?.google_place_id || '',
                location: "",
                logistics: app.opportunity?.logistics_info || {},
                salary: app.opportunity?.specifics_info?.salary || null,
                duration: app.opportunity?.opportunity_duration_type?.duration_type || null
              }
            });
          }
        }
      });

      currentPage++;
    } while (currentPage <= totalPages);

    await fs.ensureDir(path.dirname(USERS_FILE));
    await fs.writeJson(USERS_FILE, results, { spaces: 2 });

    console.log(`✅ ${results.length} unique applications saved to users.json`);
    const logFile = path.join(__dirname, '../logs/ep_sync.log');
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] Synced ${results.length} EPs\n`);
  } catch (error) {
    console.error('❌ Error while fetching users from EXPA:', error.message);
  }
}
module.exports = {
  fetchAllEPs
}
