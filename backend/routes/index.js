const loginRoute = require('./login')

const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    res.status(200).json({ test: 'hello world' })
  })

  app.use('/login', loginRoute)

  app.use('*', (req, res) => {
    res.status(404).send('Page not found')
  })
}

module.exports = constructorMethod
