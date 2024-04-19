const router = require('express').Router()
const { fetchAll, createArticle, deleteArticle, updateArticle, dashFetchAll } = require('../controllers/articlesController')
const { verifyToken, verifyRoles } = require('../middlewares/jwtAuth')

module.exports = app => {


    router.get('/articles', fetchAll)
          .get('/dash-articles', verifyToken, verifyRoles(['ADMIN']), dashFetchAll)
          .post('/article/create', verifyToken, verifyRoles(['ADMIN']), createArticle)
          .delete('/articles/delete', verifyToken, verifyRoles(['ADMIN']), deleteArticle)
          .post('/articles/update', verifyToken, verifyRoles(['ADMIN']), updateArticle)
          



    app.use('/api/v1', router)
}