const convert = require('xml-js');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Building = require('../models/Building');
const User = require('../models/User');
const Attachment = require('../models/Attachment');
const crypto = require('crypto');



exports.fetchAll = async (req, res) => {
    try {
        const buildingList = await Building.findAll({
            include:[
                {
                    model: User, as: 'user'
                }
                ,
                {
                    model: Attachment, as: 'attachements',
                }
            ]
        })

        return res.status(200).json({buildingList})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
}

exports.dashFetchAll = async (req, res) => {
    const { offset, limit } = req.query

    try {
        const fullList = await Building.findAll({})
        const user = await User.findByPk(req.user.id)

        if(user.roles.includes('ADMIN')) {
            const buildingList = await Building.findAll({
                include:[
                    {
                        model: User, as: 'user'
                    }
                    ,
                    {
                        model: Attachment, as: 'attachements',
                    }
                ],
                limit: parseInt(limit) || null,
                offset: parseInt(offset) || null
            })

            return res.status(200).json({buildingList, pages: fullList.length / parseInt(limit)})

        }else{
            const buildingList = await Building.findAll({
                where: {userId: user.id},
                include:[
                    {
                        model: User, as: 'user'
                    }
                    ,
                    {
                        model: Attachment, as: 'attachements',
                    }
                ],
                limit: parseInt(limit) || null,
                offset: parseInt(offset) || null
            })

            return res.status(200).json({buildingList, pages: fullList.length / parseInt(limit)})

        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
}


exports.ImportBuildingFromXML = async (req, res) => {
    const { uploadedFile } = req.body
    const user = req.user

    const filePath = process.env.XML_FILE;
    let files = fs.readdirSync(filePath)
    files = files.filter(f => path.extname(f) === '.xml')
    if(files.length < 1) return res.status(400).json({message: 'Xml file not exist!'})
    let file = ''
    if( files.includes(uploadedFile) ){
        file = files.filter(f => f === uploadedFile)
    }else{
        return res.status(400).json({message: 'Xml file not exist!'})
    }
    

    const xmlFile = fs.readFileSync(filePath+file[0], 'utf8', (err, data)=>{
        if(err) return res.status(403).json({message: err.message})
        return data
    });
    const jsonData = JSON.parse(convert.xml2json(xmlFile, {compact: true, spaces: 2}));

    
    for(let i=0;i<jsonData.Data.Ad.length;i++){
        let element = jsonData.Data.Ad[i]

        // Building info
        const objectId = element._attributes.ObjectId
        const title = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'title')._text
        const description = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'description')._text
        const buildingYear = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'buildingYear')._text
        const condition = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'condition')._text
        const space = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'space')._text
        const bedrooms = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'bedrooms')._text
        const kitchens = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'kitchens')._text
        const bathrooms = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'bathrooms')._text
        const price = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'price')._text
        const currency = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'currency')._text
        const street = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'street')._text
        const zip = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'zip')._text
        const city = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'city')._text
        const country = element.BuildingInfos.BuildingInfo.find(attr => attr._attributes.Field == 'country')._text


        let attachements = []
        for(let j=0; j<element.Attachments.Attachment.length; j++){
            let elem = element.Attachments.Attachment[j]
            const file = elem._attributes.File
            const category = elem._attributes.Category
            const type = elem._text
            attachements.push({file, category, type})
        }


        await Building.create({
            objectId, title, description, buildingYear, condition, space, bedrooms, kitchens, bathrooms, price, currency, street, zip, city, country,
            userId: user.id,
            attachements
        },{
            include: [{
                association: Building.Attachment,
                include: [Building.Attachment]
            }] 
        })
        .then(()=>console.log('Bulding info imported'))
        .catch(err=>console.log(err.message))
    
        

       
    };
    
    // remove file
    fs.unlinkSync(filePath + file[0])


    return res.status(200).json({message: 'Data imported'})




        
    
}


exports.createOffer = async (req, res) => {
    const {objectId, title, description, buildingYear, condition, space, bedrooms, kitchens, bathrooms, price, currency, street, zip, city, country, userId} = req.body
    if(!objectId || !title || !price || !currency || !street || !zip || !city || !country || !userId ) return res.status(400).json({message: 'All these fields are required!'})
   
    // If has files
    let attachements = []
    if(req.files?.length) {
        let uploadedFiles = req.files
        for(let i=0; i< uploadedFiles.length; i++){
            let category = 0;
            if(uploadedFiles[i].mimetype == 'image/png' || uploadedFiles[i].mimetype == 'image/jpeg' || uploadedFiles[i].mimetype == 'image/jpg'){
                category = 1
            }else if(uploadedFiles[i].mimetype == 'application/pdf'){
                category = 2
            }else if(uploadedFiles[i].mimetype == 'video/mp4'){
                category = 3
            }
    
            attachements.push({
                file: uploadedFiles[i].filename,
                category,
                type: 'Manual upload'
            })
        }
    }
    
    try{
        await Building.create({
            objectId, title, description, buildingYear, condition, space, bedrooms, kitchens, bathrooms, price, currency, street, zip, city, country,
            userId,
            attachements

        }, {
            include: [
                {
                    association: Building.Attachment,
                    include: [Building.Attachment]
                }
            ]
        })
        res.status(200).json({message: 'Building data created'})
    }catch(err){
        res.status(500).json({message: 'Internal server error!'})
        console.log(err.message);
    }

}


exports.deleteProduct = async (req, res) => {
    const { product } = req.query
    if(!product) return res.status(400).json({message: 'Error! Product not exist'})
    try {
        const getProduct = await Building.findByPk(product)
        if(!getProduct) return res.status(400).json({message: 'Error! Product not exist'})

        // Delete Product
        const attachements = await Attachment.findAll({where: {building_id : getProduct.id}})
        if(attachements?.length){
            for(let i=0;  i<attachements.length; i++){
                await attachements[i].destroy()
                
            }
        }
        await getProduct.destroy({
            include: [
                {
                    association: Building.Attachment,
                    include: [Building.Attachment]
                }
            ]
        })

        return res.status(200).json({message: 'Product deleted.', productId:product})

        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}







// Upload files function
exports.uploadFiles = () => {
    // create multer method for file upload
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/products')
        },
        filename: (req, file, cb) => {
            cb(null, crypto.randomBytes(16).toString('hex') + Date.now() + path.extname(file.originalname))
        }
    })
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4', 'application/pdf']
    const upload = multer({
        storage,
        // limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
        fileFilter: (req, file, cb) => {
            if(!allowedTypes.includes(file.mimetype) ){
                cb(null, false)
                const error = new Error('File type not allowed')
                error.name = 'ExtensionError'
                return cb(error)
            }
            cb(null, true)
        }
    })
    return upload
}