require('dotenv').config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const schedulerRoutes = require("./routes/scheduler");

app.use("/auth", authRoutes);
app.use("/scheduler", schedulerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
