const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/sequilize')
const bcrypt = require('bcrypt')

class User extends Model {}
User.init({
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    roles: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: ['USER']
    },
    company: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    website: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    activateEmailToken: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:''
    }
}, {
    sequelize,
    modelName: 'User',
    underscored: true,
    hooks: {
        beforeCreate: function(user, options){
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
        }
    }
})



module.exports = User