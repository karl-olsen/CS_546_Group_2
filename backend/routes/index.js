const loginRoute = require('./login')
const courseRoute = require('./courses')
const enrollRoute = require('./enroll')
const dropRoute = require('./drop')

const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    res.status(200).json({ test: 'hello world' })
  })

  app.use('/login', loginRoute)
  app.use('/courses', courseRoute);
  app.use('/enroll', enrollRoute);
  app.use('/drop', dropRoute);

  app.use('*', (req, res) => {
    res.status(404).send('Page not found')
  })
}

module.exports = constructorMethod
