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
app.use("/api/users", require("./routes/users"));
app.use("/api/orders", require("./routes/Orders"));
app.use('/api/reviews', require('./routes/reviews'));


app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});