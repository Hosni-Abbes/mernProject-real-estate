const router = require('express').Router()
const { fetchAll, ImportBuildingFromXML, createOffer, uploadFiles, deleteProduct, dashFetchAll } = require('../controllers/buildingController')
const { verifyToken, verifyRoles } = require('../middlewares/jwtAuth')

module.exports = app => {



    router.get('/products', fetchAll)
          .get('/dash-products', verifyToken, verifyRoles(['ADMIN', 'USER']), dashFetchAll)
          .post('/xml-import', verifyToken, verifyRoles(['ADMIN']), ImportBuildingFromXML)
          .post('/create', verifyToken, verifyRoles(['ADMIN', 'USER']), uploadFiles().array('attachements', 10) , createOffer)
          .delete('/products/delete', verifyToken, deleteProduct)



    app.use('/api/v1', router)
}