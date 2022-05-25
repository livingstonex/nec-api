const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const cors = require('cors');
const ENV = require('./utils/env.utils');
const { client } = require('./utils/cache.utils');

//== Load env files ==//
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();
// const db = require('./models/sql');

//== Route files ==//
const routes = require('./routes');

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
if (ENV.dev) {
  app.use(morgan('dev'));
}

app.get('/healthcheck', (req, res) => {
  res.send('Zeenab API is online.');
});

//=== mount route files ===//
app.use('/api', routes);

//== General Error handler middleware ==//
app.use(errorHandler);

//== Initialize port and server on specified port ==//
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.rainbow
  );
  client.connect().catch((err) => console.error('REDIS Err: ', err));
});

//== Handle global error on server initialization ==//
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  // Close server and exit process
  server.close(() => process.exit(1));
});
