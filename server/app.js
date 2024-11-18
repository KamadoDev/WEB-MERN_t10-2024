const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(express.json()); // Để đọc dữ liệu JSON
app.use(cors());
app.options("*", cors);

// middleware
app.use(bodyParser.json());

// Routes Categories
const categoryRoutes = require("./routes/categoriesRoutes");
app.use(`/api/category`, categoryRoutes);

const subCategoryRoutes = require("./routes/subCategoriesRoutes");
app.use(`/api/subcategory`, subCategoryRoutes); // Routes Subcategories

// Routes Products
const productsRoutes = require("./routes/productsRoutes");
app.use(`/api/products`, productsRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    // Database is ready
    console.log("Database Connection is ready...");
    // Server is ready
    app.listen(process.env.PORT, () => {
      console.log(`server is running http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed. Error: ", err);
  });
