const dotenv = require('dotenv');
dotenv.config({ path: './../../config.env' });
const fs = require('fs');
const Tour = require('./../../models/tourModels');

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

// IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
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
