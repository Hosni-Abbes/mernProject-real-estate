const router = require('express').Router()
const { registerAction, accountActivationAction, loginAction, handleRefreshToken, logoutAction } = require('../controllers/auth')


module.exports = app => {

    router.post('/register', registerAction)
          .post('/login', loginAction)
          .get('/logout', logoutAction)
          .get('/activate-email', accountActivationAction)
          
          .get('/refresh', handleRefreshToken)


    app.use('/api/v1/auth', router)
}