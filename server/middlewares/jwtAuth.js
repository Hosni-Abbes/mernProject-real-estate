const jwt = require('jsonwebtoken')

exports.generateAccessToken = (user) => jwt.sign(
    {
        id: user.id,
        roles: user.roles
    },
    process.env.JWT_SECRET,
    { expiresIn: '10min' }
)
exports.generateRefreshToken = (user) => jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH,
    { expiresIn: '1d' }
)



exports.verifyToken = (req, res, next) => {
    const headers = req.headers.authorization || req.headers.Authorization
    if(!headers?.startsWith('Bearer ')) return res.status(401).json({message: 'You are not authorized!'})
    const token = headers.split(' ')[1]
    
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if(error) return res.status(403).json({message: 'Forbidden!'})
        req.user = payload
        next()
    })   

}




exports.verifyRoles = allowedRoles => {
    return (req, res, next) => {
        if(!req?.user?.roles) return res.status(401).json({message: 'You are not authorized!'})
        const reqRoles = req.user.roles
        const result = reqRoles.find(role => allowedRoles.includes(role))
        if(!result) return res.status(401).json({message: 'You are not authorized!'})
        next()
    }

}


