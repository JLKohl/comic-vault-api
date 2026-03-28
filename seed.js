const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Issue = require('./src/models/issue');
const issuesData = require('./data/issues.json');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    await Issue.deleteMany({});
    console.log("Cleared old issues.");

    await Issue.insertMany(issuesData);
    console.log("Successfully seeded issues from JSON!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();