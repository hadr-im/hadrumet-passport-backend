const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const { fetchAllEPs } = require("./scripts/fetchExpaUsers"); 



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("Hadrumet Passports Backend is running!");
});


app.use("/api/auth", require("./routes/authRoutes"));
//app.use("/api/ep", require("./routes/epRoutes"));
//app.use("/api/amdin", require("./routes/adminRoutes"));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

cron.schedule('0 6 * * *', () => {
  console.log('⏰ CRON triggered: Fetching EPs from EXPA...');
  fetchAllEPs();
});