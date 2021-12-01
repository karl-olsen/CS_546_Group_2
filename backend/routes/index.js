const loginRoute = require('./login');
const courseRoute = require('./courses');
const enrollRoute = require('./enroll');
const dropRoute = require('./drop');
const registerRoutes = require('./register');
const logoutRoutes = require('./logout');
const submitRoutes = require('./submit');
const assignmentsRoute = require('./assignments');

const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    res.status(200).json({ test: 'hello world' });
  });

  app.use('/login', loginRoute);
  app.use('/courses', courseRoute);
  app.use('/enroll', enrollRoute);
  app.use('/drop', dropRoute);
  app.use('/register', registerRoutes);
  app.use('/logout', logoutRoutes);
  app.use('/submit', submitRoutes);
  app.use('/assignments', assignmentsRoute);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page not found' });
  });
};

module.exports = constructorMethod;
