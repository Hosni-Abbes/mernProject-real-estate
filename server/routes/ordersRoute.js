const router = require('express').Router()
const { fetchOrders, orderAndPaymentAction, paymentSuccess, paymentFailed, archiveOrder } = require('../controllers/ordersController')
const { verifyToken, verifyRoles } = require('../middlewares/jwtAuth')

module.exports = app => {



    router.get('/orders', verifyToken, verifyRoles(['ADMIN', 'USER']), fetchOrders)
          .post('/orders/archive', verifyToken, verifyRoles(['ADMIN']), archiveOrder)
          .post('/payment', orderAndPaymentAction)
          .get('/payment-success', paymentSuccess)
          .get('/payment-failure', paymentFailed)



    app.use('/api/v1', router)
}