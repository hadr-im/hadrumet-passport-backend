const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const { fetchAllEPs } = require("./scripts/fetchExpaUsers"); 
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const authenticateToken = require('./middleware/authmiddleware');




const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get("/", (req, res) => {
    res.send("Hadrumet Passports Backend is running!");
});


// Public route
app.use("/api/auth", require("./routes/authRoutes"));

// Protect all other routes
app.use(authenticateToken);
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use('/api/places', require("./routes/placeRoutes"));
app.use("/api/sendEmail", require("./routes/emailRoutes"));
app.use("/api/realizedEps", require("./routes/realizedEpsRoutes"));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/localApps', require('./routes/localAppsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/categories', require('./routes/categoriesRoute'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

cron.schedule('0 6 * * *', () => {
  console.log('⏰ CRON triggered: Fetching EPs from EXPA...');
  fetchAllEPs();
});