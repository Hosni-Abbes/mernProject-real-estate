const User = require('../models/User')
const { Op } = require('sequelize');
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwtAuth')
const jwt = require('jsonwebtoken')

exports.registerAction = async (req, res) => {
    const { name, email, password, address, phone, mobile, website, company } = req.body
    if(!name || !email || !password || !address || !phone) return res.status(400).json({message: "Fields are required."})


    try {
        // check if user with this email already exist
        const userExist = await User.findOne({where: {email}})
        if(userExist) return res.status(400).json({message:'This email already exist'})
        
        // create email activation token
        const activateEmailToken = process.env.EMAIL_TOKEN.split('').sort(function(){return 0.5-Math.random()}).join('') + Date.now()
        
        // create user to db
        const user = await User.create({...req.body, activateEmailToken})

        // send activation email to user
        sendEmail(user, activateEmailToken)

        res.status(200).json({user: {id: user.id, name, email}})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


// Activate Email
exports.accountActivationAction = async (req, res) => {
    const { user, token } = req.query
    try{
        // check if data sended in url query are correct and belongs to correct user
        const findUser = await User.findByPk(user)
        if(!findUser) return res.status(400).render('activateAccountEmail/failed.ejs', {message: 'Wrong URL: User not exist.', url: process.env.FRONT_BASE_URL})
        if(findUser.activateEmailToken != token) return res.status(400).render('activateAccountEmail/failed.ejs', {message: 'Wrong URL: Incorrect token or User already activated.', url: process.env.FRONT_BASE_URL})

        // update user ( remove token from table)
        await findUser.update({activateEmailToken: ''})

        return res.status(200).render('activateAccountEmail/success.ejs', {url: process.env.FRONT_BASE_URL})

    }catch(err){
        res.status(500).json({message: err.message})
    }

}


// Login Action
exports.loginAction = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) return res.status(400).json({message: 'Email and password are required!'})

    try {
        // find user
        const user = await User.findOne({where: {email}})
        if(!user) return res.status(403).json({message: 'Wrong email or password!'})

        // check user password
        const passwordValid = await bcrypt.compare(password, user.password)
        if(!passwordValid) return res.status(403).json({message: 'Wrong email or password!'})

        // check if account is active
        if(user.activateEmailToken?.length > 0) return  res.status(400).json({message: 'Account is not activated. Please check your email and click the link we send to you!'})

        // generate access & refresh tokens
        const accesstoken = generateAccessToken(user)
        const refreshtoken = generateRefreshToken(user)
        // add refresh token to user table
        await user.update({refreshToken: refreshtoken})
        await user.save()

        // set refresh token to cookies
        res.cookie('user_id', refreshtoken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1day
            sameSite: 'None',
            secure: true,
            // signed: true
        } )

        // return success login
        res.status(200).json({
            user: {id: user.id, name: user.name, email: user.email, roles: user.roles},
            accesstoken
        })
        // return res.status(200).json({user})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}



// Logout Action
exports.logoutAction = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.user_id) return res.sendStatus(204)
    const refreshToken = cookies.user_id

    const user = await User.findOne({where: {refreshToken}})
    // if cookie exist and no user with this cookie then clear the cookie
    if(!user) {
        res.clearCookie('user_id', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        })
        return res.sendStatus(204)
    }
    // if user have cookie remove refreshToken from DB and clear cookie
    await user.update({refreshToken:''})
    await user.save()
    res.clearCookie('user_id', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    })
    return res.sendStatus(204)

    
}



// Refresh token
exports.handleRefreshToken = (req, res) => {
    const cookies = req.cookies
    if(!cookies?.user_id) return res.sendStatus(401)
    const refreshToken = cookies.user_id

    jwt.verify(refreshToken, process.env.JWT_REFRESH, async (error, payload) => {
        if(error) {
            res.clearCookie('user_id', {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
            })
            return res.sendStatus(403)
        }
        // Check if cookie is in DB user table
        await User.findOne({where: {refreshToken}})
        .then(data => {
            if(!data) return res.sendStatus(401)
            // generate new accesstoken and send to response
            const user = { id: payload.id, roles: data.roles }
            const accesstoken = generateAccessToken(user)
            res.json({
                user: {id: data.id, name: data.name, email: data.email, roles: data.roles},
                accesstoken
            })
            
        })
        .catch(err => res.status(500).json({message: err.message}) )
        
    })
        


}




// Send Mail function
const sendEmail = (user, emailToken) => {
    // create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // Mail Optoions
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Account Activation',
        text: `Hello ${user.name}, Click this link to activate your account: 
                ${process.env.BASE_URL}/api/v1/auth/activate-email?user=${user.id}&token=${emailToken}`
    }

    // send Email
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error) return res.status(500).json({message: error.message})
        return true
    })


}