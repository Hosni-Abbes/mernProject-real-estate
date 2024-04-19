const { Sequelize } = require('sequelize')

module.exports = new Sequelize({
    database: 'buildings',
    host: '127.0.0.1',
    password: '',
    username: 'root',
    dialect: 'mysql',
    pool: {
        min: 1,
        max: 5,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
})