const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const cors = require('cors');

//== Load env files ==//
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

//== Route files ==//

//== App Initialization ==//
const app = express();

//== Body Parser ==//
app.use(express.json());

//== Cors ==//
const corsOptions = {
  origin: '*',
};
app.use(cors());

//== Dev logging middleware ==//
if (process.env.NODE_ENV === 'development') {
  app.us;
}

app.get('/healthcheck', (req, res) => {
  res.send('Zeenab API is online.');
});

//== General Error handler middleware ==//
app.use(errorHandler);

//== Initialize port and server on specified port ==//
const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.rainbow
  );
});

//== Handle global error on server initialization ==//
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  // Close server and exit process
  server.close(() => process.exit(1));
});
