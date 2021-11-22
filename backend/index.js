const express = require('express');
const cors = require('cors');
const env = require('./env');
const cookieParser = require('cookie-parser');
const app = express();
const seedData = require('../backend/tasks/seed');

const corsOptions = {
  // all network requests allowed from the frontend URL only
  origin: env?.frontendUrl,
};

app.use(cors(corsOptions));

app.use(cookieParser());

const configRoutes = require('./routes');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = (req, res, next) => {
  const log = `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl}`;
  console.log(log);
  next();
};

app.use(logger);

configRoutes(app);

app.listen(env?.port || 3001, () => {
  console.log('Ez-el backend server running on http://localhost:3001');
});
