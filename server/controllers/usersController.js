const Attachment = require("../models/Attachment")
const Building = require("../models/Building")
const User = require("../models/User")

exports.fetchUsers = async (req, res) => {
    const { limit, offset } = req.query

    try {
        const usersList = await User.findAll({})
        if(!limit || !offset) {
            return res.status(200).json({usersList})
        }else{
            const users = await User.findAll({
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
            res.status(200).json({usersList: users, pages: usersList?.length / parseInt(limit)})
        }
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


exports.deleteUser = async (req, res) => {
    const { user } = req.query
    try {
        const getUser = await User.findByPk(user)
        if(!getUser) return res.status(400).json({message: 'Error! User not exist'})

        
        // Delete user & associated Products
        const userProducts = await Building.findAll({where: {userId: user}})
        if(userProducts?.length){
            for(let i=0;  i<userProducts.length; i++){
                await Attachment.destroy({where:{building_id: userProducts[i].id}})
                
            }
            await Building.destroy({where: {user_id: user}})
        }
        await getUser.destroy()

        return res.status(200).json({message: 'User deleted.', userId:user})

        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}



exports.updateUserRole = async (req, res) => {
    const { user } = req.query
    try {
        const getUser = await User.findByPk(user)
        if(!getUser) return res.status(400).json({message: 'Error! User not exist'})

        
        // update user role
        await getUser.update({roles: [...getUser.roles, 'ADMIN']})
        await getUser.save()

        return res.status(200).json(getUser)

        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}