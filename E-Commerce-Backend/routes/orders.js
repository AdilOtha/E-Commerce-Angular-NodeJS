const { Router } = require('express');
var express = require('express');
var router = express.Router();
const db = require('../config/db');

// GET ALL ORDERS
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });

    let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1; //set page value
    let limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10; //set limit

    let startValue, endValue;

    if (page > 0) {
        startValue = (page * limit) - limit; //0,10,20,30
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }

    let query = "SELECT o.id, p.title as name, p.description, p.price, u.username FROM `orders_details`";
    let condition = " od INNER JOIN orders o ON o.id = od.order_id INNER JOIN products p ON p.id = od.product_id INNER JOIN users u ON o.user_id = u.id ORDER BY o.id LIMIT " + limit + " OFFSET " + startValue;
    db.query(query + condition, (errors, results) => {
        if (errors) {
            res.status(500).json({
                message: errors.message || `DB error`
            });
        }
        else if (results.length <= 0) {
            res.json({
                message: `No orders found`
            });
        }
        else {
            //console.log(fields);
            res.status(200).json({
                count: results.length,
                orders: results
            });
        }
    })
});


// GET SPECIFIC ORDER BY ID
router.get('/:orderId', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    let orderId = req.params.orderId;
    console.log(orderId);

    let query = "SELECT o.id, p.title as name, p.description, p.price, u.username FROM `orders_details`";
    let condition = " od INNER JOIN orders o ON o.id = od.order_id INNER JOIN products p ON p.id = od.product_id INNER JOIN users u ON o.user_id = u.id WHERE o.id = " + orderId;
    db.query(query + condition, (errors, results) => {
        console.log(results);
        if (errors) {
            res.status(500).json({
                message: errors.message || `DB error`
            });
        }
        else if (results.length <= 0) {
            res.json({
                message: `No product found with orderId: ${orderId}`
            });
        }
        else {
            //console.log(fields);
            res.status(200).json({
                count: results.length,
                orders: results
            });
        }
    })
});


// PLACE NEW ORDER
router.post('/new', (req, res) => {
    let { userId, products } = req.body;

    if (userId !== null && userId > 0 && !isNaN(userId)) {
        let query = `INSERT INTO orders (user_id) VALUES (${userId})`;
        db.query(query, (errors, results) => {
            if (errors) {
                res.status(500).send({
                    message: errors.message || "DB error"
                });
            }
            else {
                let newOrderId = results.insertId;
                if (newOrderId > 0) {
                    console.log(newOrderId)

                    products.forEach((p) => {
                        //console.log(p)
                        let selectQuery = `SELECT quantity FROM products WHERE id= ${p.id}`;
                        db.query(selectQuery, (errors, results) => {
                            if (errors) {
                                res.status(500).send({
                                    message: errors.message || "DB error"
                                });
                            }
                            else {
                                //console.log(results[0].quantity);
                                //console.log(p.incart);
                                let inCart = p.incart;
                                let newQuantity;
                                if (results[0].quantity > 0) {
                                    if ((results[0].quantity - inCart) >= 0) {
                                        newQuantity = results[0].quantity - inCart;
                                        console.log(newQuantity);
                                    } else {
                                        newQuantity = 0;
                                    }
                                }
                                else {
                                    newQuantity = 0;
                                }
                                let insertOrderDetails = `INSERT INTO orders_details (order_id, product_id, quantity) VALUES ('${newOrderId}', '${p.id}', '${inCart}')`
                                db.query(insertOrderDetails, (errors, results) => {
                                    if (errors) {
                                        res.status(500).send({
                                            message: errors.message || "DB error"
                                        });
                                    }
                                    else {
                                        let updateQuery = `UPDATE products SET quantity = '${newQuantity}' WHERE products.id = ${p.id}`;
                                        db.query(updateQuery,(errors,results)=>{
                                            if (errors) {
                                                res.status(500).send({
                                                    message: errors.message || "DB error"
                                                });
                                            }
                                            else{
                                                console.log(newQuantity);
                                            }
                                        })
                                    }
                                })
                            }
                        });
                    });                    
                } else {
                    res.status(500).send({
                        message: `error while adding to order details, orderId: ${newOrderId}`,
                        success: false
                    });
                }                
                res.status(200).send({
                    message: `OrderId ${newOrderId} successfully placed`,
                    order_id: newOrderId,
                    success: true,
                    products: products
                });
            }
        })
    }
    else{
        res.status(500).send({
            message: `error while adding new order`,
            success: false
        });
    }
});

// FAKE PAYMENT GATEWAY ENDPOINT
router.post('/payment',(req,res)=>{
    setTimeout(()=>{
        res.status(200).send({
            success: true
        })
    },4000);
})

module.exports = router;