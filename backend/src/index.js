const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./utils/db'); // Mongoose connection function
const router = require('./routes/userRoutes'); // routes using Mongoose
const cors = require("cors");

dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);
ConnectDB();
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
ConnectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", router);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
