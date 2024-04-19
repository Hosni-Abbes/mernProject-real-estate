const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { verifyToken, verifyRoles } = require('../middlewares/jwtAuth')


module.exports = app => {

    // 
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname) )
        }
    })
    const upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
            if(file.mimetype != 'text/xml' && path.extname(file.originalname) != '.xml' ) {
                cb(null, false)
                const error = new Error('Wrong file type')
                error.message = 'Wrong file type'
                error.name = "ExtensionError"
                return cb(error)
            }

            cb(null, true)
        },
        limits: { files: 1 }

    })

    router.post('/upload-xml', verifyToken, verifyRoles(['ADMIN']), upload.single('xmlfile'), (req, res)=>{
        return res.status(200).json({message: 'File uploaded', file: req.file?.filename})
    })


    app.use('/api/v1', router)
}