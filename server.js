// method to save our variables present in config file as enviornmental variables
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// console.log(process.env);

// note ---> always place this above app
// connecting our express app to database
const mongoose = require('mongoose');
const DB = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// this will return promise
mongoose
  .connect(DB, {
    // ------>   to get connected to our atlas database
    // .connect(process.env.DATABASE_LOCAL, {                // ------>   to get connected to our local database
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB Connection successful !!');
  });

// creating Schema
// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'A tour must have a name'],
//     unique: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   price: {
//     type: Number,
//     require: [true, 'A tour must have a price'],
//   },
// });

// // creating model
// const Tour = mongoose.model('Tour', tourSchema);

// testing model
// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497,
// });
// const testTour = new Tour({
//   name: 'The Central Park',
//   price: 0,
//   rating: 4.8,
// });
// this testTour is an instance to our tour model !!

// it will save this into our database
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('Error:', err);
//   });

const app = require('./app');
const port = 5500;

// to see what enviornment variable does express uses
// console.log(app.get('env'));

// to see enviornment variables used by node.js
// console.log(process.env);

app.listen(port, '127.0.0.1', () => {
  console.log(`App running on ${port}...`);
});
