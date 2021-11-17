const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    res.status(200).json({ test: 'hello world' });
  });

  app.use('*', (req, res) => {
    res.status(404).send('Page not found');
  });
};

module.exports = constructorMethod;
