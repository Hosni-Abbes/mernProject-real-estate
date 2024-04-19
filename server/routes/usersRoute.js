const { fetchUsers, deleteUser, updateUserRole } = require('../controllers/usersController')
const { verifyToken, verifyRoles } = require('../middlewares/jwtAuth')

const router = require('express').Router()

module.exports = app => {

    router.post('/list', verifyToken, verifyRoles(['ADMIN']), fetchUsers)
          .delete('/delete', verifyToken, verifyRoles(['ADMIN']), deleteUser)
          .post('/update', verifyToken, verifyRoles(['ADMIN']), updateUserRole)

    app.use('/api/v1/users', router)
}