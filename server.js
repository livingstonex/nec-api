const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const cors = require('cors');
const ENV = require('./utils/env.utils');
const { client } = require('./utils/cache.utils');
const { swaggerDocs } = require('./utils/swagger.utils');
const madge = require('madge');
const fileUpload = require('express-fileupload');
// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
// const { version } = require('./package.json');

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

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/temp/',
  // createParentPath: true,
  safeFileNames: true,
  preserveExtension: true,
  abortOnLimit: true,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  limitHandler: (req, res, next) => {
    res.status(413).json({
      status: 'error',
      message: 'File too large',
      data: '',
    });
    next();
  }
}));

/**
 * @openapi
 * '/healthcheck':
 *  get:
 *    tags:
 *      - Healthcheck
 *    summary: Responds if the app is up and running
 *    responses:
 *      200:
 *        description: App is up and running
 */
app.get('/healthcheck', (req, res) => {
  res.send('Zeenab API is online.');
});

//=== mount route files ===//
app.use('/api', routes);

//== General Error handler middleware ==//
app.use(errorHandler);

// == Initialize docs == //
// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       title: 'NEC API',
//       description:
//         'API for the NEC Application: import, export and local merchant.',
//       contact: { name: 'Anonymous Dev.' },
//       servers: [`http://localhost:${ENV.get('PORT')}`],
//     },
//   },
//   apis: ['./routes/**.js'],
// };

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'NEC API',
//       version,
//     },
//     components: {
//       securitySchema: {
//         bearerAuth: {
//           type: 'http',
//           schema: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//     security: [
//       {
//         bearerAuth: [],
//       },
//     ],
//   },
//   apis: ['./routes/**.js', './models/sql/**.js'],
// };

// const swaggerSpec = swaggerJsDoc(options);

// function swaggerDocs(app, port) {
//   // Swagger page
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//   // Docs in JSON format
//   app.get('docs.json', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(swaggerSpec);
//   });

//   log.info(`Docs available at: http://localhost:${port}/api-docs`);
// }

//== Initialize port and server on specified port ==//
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.rainbow
  );

  swaggerDocs(app, PORT);
  client.connect().catch((err) => console.error('Redis Error: ', err));

  madge('server.js').then((res) => {
    console.log(res.circularGraph());
  });
});

//== Handle global error on server initialization ==//
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  // Close server and exit process
  server.close(() => process.exit(1));
});
