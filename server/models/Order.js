const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/sequilize')

class Order extends Model {}
Order.init({
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: ''
    },
    paymentRef: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: ''
    },
    amountPayed: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: '0'
    },
    amountToCompletePay:{
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: '0'
    },
    currency: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: ''
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Order',
    underscored: true
})




module.exports = Order