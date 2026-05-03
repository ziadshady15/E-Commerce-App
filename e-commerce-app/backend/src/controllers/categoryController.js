const Category = require("../models/Category");

const DEFAULT_CATEGORIES = [
  {
    name: 'Cars',
    description: 'High-speed thrills and automotive elegance — frames featuring iconic cars, racing legends, and vintage classics perfect for any car enthusiast.',
  },
  {
    name: 'Music',
    description: 'Celebrate the rhythm of life with frames inspired by musical instruments, legendary artists, album artwork, and the culture of sound.',
  },
  {
    name: 'Sports',
    description: 'Capture the energy of competition — frames showcasing legendary moments, athletes, and the passion of football, basketball, tennis, and more.',
  },
  {
    name: 'Series',
    description: 'From binge-worthy dramas to cult classics, frames inspired by the most iconic TV series and streaming shows that defined generations.',
  },
  {
    name: 'Art & Culture',
    description: 'A curated collection of frames drawing from fine art, cultural heritage, world traditions, and timeless masterpieces across civilizations.',
  },
  {
    name: 'Quotes',
    description: 'Words that move, inspire, and resonate — beautifully typeset frames featuring motivational quotes, literary lines, and life philosophies.',
  },
];


const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      console.log("Categories seeded successfully!");
    } else {
      console.log("Categories already exist in the database.");
    }
  } catch (error) {
    console.error("Error seeding categories:", error.message);
  }
};


const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { seedCategories, getCategories };