const User = require('./User')
const Building = require('./Building')
const Attachment = require('./Attachment')
const Order = require('./Order')

const Article = require('./Article')



Building.User = Building.belongsTo(User, { as: 'user' })

Building.Attachment = Building.hasMany(Attachment, {  as: 'attachements' })


Building.belongsToMany(Order, { through: 'orders_mm', as: 'order' })
Order.belongsToMany(Building, { through: 'orders_mm', as: 'building' })

Order.User = Order.belongsTo(User, { as: 'user'})
// Order.User = Order.belongsTo(User, { as: 'user' })
