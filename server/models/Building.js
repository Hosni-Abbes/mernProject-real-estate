const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/sequilize')

class Building extends Model {}
Building.init({
    objectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    buildingYear: {
        type: DataTypes.STRING(50),
    },
    condition: {
        type: DataTypes.STRING(50),
    },
    space: {
        type: DataTypes.STRING(50),
    },
    bedrooms: {
        type: DataTypes.STRING(50),
    },
    kitchens: {
        type: DataTypes.STRING(50),
    },
    bathrooms:{
        type: DataTypes.STRING(50),
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'USD'
    },
    street: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    zip: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Building',
    underscored: true
})



module.exports = Building