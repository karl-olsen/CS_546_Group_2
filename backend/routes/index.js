const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    res.send('ok');
  });

  app.use('*', (req, res) => {
    res.status(404).send('Page not found');
  });
};

module.exports = constructorMethod;
