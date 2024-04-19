require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const http = require('http')
const path = require('path')

const app = express()
const PORT = process.env.PORT

// Middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    credentials: true,
    origin: process.env.FRONT_BASE_URL,
    optionsSuccessStatus: 200,
}))
// define static directories
app.use('/products', express.static(path.join(__dirname, 'public/products')));
app.use('/uploads/', express.static(path.join(__dirname, 'public/admin_uploads')))

// set the app view engine to ejs
app.set('view-engine', 'ejs')

// create server 
const server = http.createServer(app)


// connect to database
// require('./config/sequilize').sync({force:true})
require('./config/sequilize').sync()
    .then(()=>console.log('database connected'))
    .catch(err => console.log(err.message))


// Require models
require('./models/index')

// Require Routes
require('./routes/authRoute')(app)
require('./routes/buildingRoute')(app)
require('./routes/articleRoute')(app)
require('./routes/ordersRoute')(app)
require('./routes/usersRoute')(app)
require('./routes/contactRoute')(app)
require('./routes/uploadRoute')(app)


// connect to server
server.listen(PORT, ()=>console.log(`server connected on port: ${PORT}`))