const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/sequilize')

class Article extends Model {}
Article.init({
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: true
    }

}, {
    sequelize,
    modelName: 'Article',
    underscored: true,
    timestamps: true,
})



module.exports = Article