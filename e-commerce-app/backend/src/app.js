const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const connectDB = require("./config/db");

const { seedCategories } = require("./controllers/categoryController"); 


connectDB().then(async () => {                                          
  await seedCategories();                                                
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/products", require("./routes/products")); 
app.use("/api/cart", require("./routes/cart")); 


app.get("/", (req, res) => {
  res.send("API Running...");
});

// Added a fallback to port 5000 just in case process.env.PORT is undefined
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});