const dotenv = require('dotenv');
dotenv.config({ path: './../../config.env' });
const fs = require('fs');
const Tour = require('./../../models/tourModels');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModels');

const mongoose = require('mongoose');
const DB = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection successful !!');
  });

// READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    // we are doing this so that we dont get password confirm validation error
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data Successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTIONS

const deleteData = async () => {
  try {
    await Tour.deleteMany(); // it will delete all such documents with similar kind of name
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  // node import-dev-data.js --import
  importData();
} else if (process.argv[2] === '--delete') {
  // node import-dev-data.js --delete
  deleteData();
}
