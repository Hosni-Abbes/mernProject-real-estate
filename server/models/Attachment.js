const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/sequilize')

class Attachment extends Model {}
Attachment.init({
    file: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Attachment',
    underscored: true
})



module.exports = Attachment