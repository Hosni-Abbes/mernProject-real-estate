const { contactAction } = require('../controllers/contactController')
const router = require('express').Router()

module.exports = app => {

    router.post('/send-email', contactAction)

    app.use('/contact', router)
}