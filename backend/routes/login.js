const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const { checkUser } = require('../data/users')

router.post('/', async (req, res) => {

    const { email, password } = req.body

    try {
        await checkUser(username, password)
        const payload = { email }
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
        })
        res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        console.log('Cookie is stored!')
    } catch(e) {
        console.log('I errored')
    }

})
  
module.exports = router