const env = require('../env')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const { checkUser } = require('../data/users')

router.post('/', async (req, res) => {

    const { email, password } = req.body

    try {
        await checkUser(email, password)
        const payload = { email }
        const secret = env.secret
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
        })
        res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        console.log('Cookie is stored!')
    } catch(e) {
        console.log(e)
    }

})
  
module.exports = router