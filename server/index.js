const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Import routes
const userRoutes = require("./routes/userRoutes");

// Use routes
app.use("/auth", userRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
