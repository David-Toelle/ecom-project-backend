const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

const productsRoutes = require("./routes/productsRoutes.js");

app.use("/api/products", productsRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
