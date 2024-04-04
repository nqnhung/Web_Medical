const express = require('express')
const morgan = require('morgan')
require('dotenv').config()

// PORT
var PORT = process.env.PORT || 6969

// controller
const authController = require('./controller/authController')
const medicineController = require('./controller/medicineController')
const purchaseController = require('./controller/purchaseController')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello Hau Tran')
    res.sendFile(path.join(__dirname,'./src/index.html'));
})

app.use(function (req, res, next) {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Download-FileName', 'x-compression');
        res.header("access-control-expose-headers", 'X-Download-FileName');
        

        // authen
        app.route('/login/:user/:password').get(authController.login)
        app.route('/register/:user/:password/:confirmPassword').get(authController.register)

        // medicine
        app.route('/getListMedicine').get(medicineController.getListMedicine)
        app.route('/getMedicine').post(medicineController.getMedicine)

        // order
        app.route('/addCartOrder').post(purchaseController.cartOrder)
        app.route('/purcharseOrder').post(purchaseController.purchaseOrder)
        app.route('/deleteOrder').post(purchaseController.deleteCartOrder)
        app.route('/getCartOrder').get(purchaseController.getListCartOrder)
        app.route('/getHistoryPuschase').get(purchaseController.getHistoryPuschase)

        next();
    } catch (err) {
        console.log(err);
        res.json({
            Status: false,
            ErrorCode: 500,
            ErrorMessages: [err.message]
        });
    }
})



app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`)
})