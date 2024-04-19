const Order = require('../models/Order');
const request = require('request');
const Building = require('../models/Building');
const User = require('../models/User');


// fetch all orders 
exports.fetchOrders = async (req, res) => {
    const { limit, offset, archived } = req.query
    const user = req.user

    if(!limit || !offset ) return res.status(400).json({message: 'An error occured!'})

    try {
        if(!user?.roles?.includes('ADMIN')) {
            const orders = await Order.findAll({where: {user_id: user?.id}})
            const ordersList = await Order.findAll({
                where: {user_id: user?.id},
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [
                    {
                        model: User, as: 'user',
                    },
                    {
                        model: Building, as: 'building'
                    }
                ]
            })
    
            return res.status(200).json({ordersList, pages: orders.length / parseInt(limit)})

        }else {
            const orders = await Order.findAll({where: {archived: parseInt(archived)}})
            const ordersList = await Order.findAll({
                where: {archived: parseInt(archived)},
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [
                    {
                        model: User, as: 'user',
                    },
                    {
                        model: Building, as: 'building'
                    }
                ]
            })
    
            return res.status(200).json({ordersList, pages: orders.length / parseInt(limit)})
        }

        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


// set order to archieve
exports.archiveOrder = async (req, res) => {
    const { order } = req.query
    if(!order) return res.status(400).json({message: 'Order not exist!'})

    try {
        const foundedOrder = await Order.findByPk(order)
        if(!foundedOrder) return res.status(400).json({message: 'Order not exist!'})
        
        await foundedOrder.update({archived: true})
        await foundedOrder.save()
        
        return res.status(200).json(foundedOrder)
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}



// Payment actions
exports.orderAndPaymentAction = async (req, res) => {
    const { userId, productsIds } = req.body

    // fetch user
    const user = await User.findByPk(userId)
    if(!user) return res.status(400).json({message: 'Error occured: incorrect user!'})
    
    // fetch products and total price
    const products = await Building.findAll({where: {id: [...productsIds]}})
    if(products.length < 1) return res.status(400).json({message: 'Error occured: Product not found!'})
    const price = products.reduce((cumm, product)=> cumm + product.price , 0 )

    // fetch last orderId
    const lastOrder = await Order.findAll({limit:1, order: [ ['id', 'DESC'] ]})
    let orderId=0
    if(lastOrder.length > 0) {
        orderId = lastOrder[0].id + 1
    }else{
        orderId=1
    }

    // prepare payment options
    const config = {
        'method': 'POST',
        'url': process.env.PAYMENT_URL + '/init-payment',
        'headers': {
            'Content-Type': 'application/json',
            'x-api-key': process.env.PAYMENT_API_KEY
        },
        body: JSON.stringify({
            "receiverWalletId": process.env.PAYMENT_WALLET,
            "token": process.env.PAYMENT_CURRENCY,
            "amount": Math.round(price),
            "type": "immediate",
            "description": "payment description",
            "acceptedPaymentMethods": [
                "wallet",
                "bank_card",
                "e-DINAR"
            ],
            "lifespan": 10,
            "checkoutForm": false,
            "addPaymentFeesToAmount": true,
            "firstName": user.name.split(' ')[0],
            "lastName": user.name.split(' ')[1],
            "phoneNumber": user.phone,
            "email": user.email,
            "orderId": orderId,
            "webhook": "https://merchant.tech/api/notification_payment",
            "silentWebhook": true,
            // "successUrl": res.render(),
            "successUrl": `${process.env.BASE_URL}/api/v1/payment-success`,
            "failUrl": process.env.BASE_URL+"/api/v1/payment-failure",
            "theme": "light"
        })
    }
    // send payment request
    request(config, async function(error, response){
        if(error) throw new Error(error)
        // go to payment form
        if(response.statusMessage !== 'OK'){
            return res.status(500).json({message :"Internal server error occured! Try again later."})
        } 
        const resp = JSON.parse(response.body)
        res.status(200).json({redirectURL: resp.payUrl})

        // Create order to DB
        const orderr = await Order.create({
            status: 'Waiting Payment',
            paymentRef: resp.paymentRef,
            amountPayed: Math.round(price),
            amountToCompletePay: price - Math.round(price),
            currency: process.env.PAYMENT_CURRENCY,
            userId: user.id,
        })            
        .catch(err=>console.log(err))
        await orderr.addBuilding(products)
    })
}

exports.paymentSuccess = async (req, res) => {
    const { payment_ref } = req.query
    
    const order = await Order.findOne({where:{paymentRef: payment_ref}})
    if(!order) return res.status(200).json({redirectURL :process.env.FRONT_BASE_URL})

    const config = {
        'method': 'GET',
        'url': process.env.PAYMENT_URL + `/${payment_ref}`,
        'headers': {
            'x-api-key': process.env.PAYMENT_API_KEY
        }
    };
    request(config, async function (error, response) {
        if (error) throw new Error(error);
        // Create order and associate data
        const resp = JSON.parse(response.body)
        if(response.statusMessage === 'OK' && resp.payment.successfulTransactions >= 1){
            await order.update({status: 'Payed'})
            await order.save()
            return res.status(200).render('orderPayments/success.ejs', {url: process.env.FRONT_BASE_URL})
        }
    });
}

exports.paymentFailed = async (req, res) => {
    const { payment_ref } = req.query
    try {
        const order = await Order.findOne({where: {paymentRef: payment_ref}})
        if(!order) return res.status(200).json({redirectURL :process.env.FRONT_BASE_URL})

        // update order status
        await order.update({status: 'Payment Failed'})
        await order.save()

        return res.status(200).render('orderPayments/failed.ejs', {url: process.env.FRONT_BASE_URL, retryUrl: `${process.env.GATEWAY_URL}&payment_ref=${payment_ref}`})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
