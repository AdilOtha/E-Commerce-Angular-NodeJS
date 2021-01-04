const { Router } = require('express');
var express = require('express');
var router = express.Router();
const db = require('../config/db');

// GET ALL PRODUCTS
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

  let query = "SELECT c.title as category, p.title as name, p.price, p.quantity, p.image, p.description, p.id FROM `products` p INNER JOIN categories c ON p.cat_id=c.id ORDER BY p.id LIMIT " + limit + " OFFSET " + startValue;
  db.query(query, (errors, results, fields) => {
    if (errors) {
      console.log(errors);
      res.status(500).json({
        message: errors.message || "DB error"
      });
    }
    else {
      res.status(200).json({
        count: results.length,
        products: results
      });
    }
  })
});

// GET SPECIFIC PRODUCT BY ID
router.get('/:productId', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  let productId = req.params.productId;
  console.log(productId);

  let query = "SELECT c.title as category, p.title as name, p.price, p.quantity, p.image, p.images,p.description, p.id FROM `products` p INNER JOIN categories c ON p.cat_id=c.id AND p.id=" + productId;
  db.query(query, (errors, results) => {
    console.log(results);
    if (errors) {
      res.status(500).json({
        message: errors.message || `DB error`
      });
    }
    else if (results.length <= 0) {
      res.json({
        message: `No product found with productId: ${productId}`
      });
    }
    else {
      //console.log(fields);
      let product = results[0];
      res.status(200).json(product);
    }
  })
});

router.get('/category/:catName', (req, res, next) => {
  let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1; //set page value
  let limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10; //set limit

  let startValue;

  let categoryName = req.params.catName;

  if (page > 0) {
    startValue = (page * limit) - limit; //0,10,20,30    
  } else {
    startValue = 0;
  }

  let query = "SELECT c.title as category, p.title as name, p.price, p.quantity, p.image, p.description, p.id FROM `products` p INNER JOIN categories c ";
  let condition = "ON p.cat_id=c.id AND c.title LIKE '%" + categoryName + "%' ORDER BY p.id LIMIT " + limit + " OFFSET " + startValue;
  db.query(query + condition, (errors, results, fields) => {
    if (errors) {
      res.status(500).json({
        message: errors.message || `DB error`
      });
    }
    else if (results.length <= 0) {
      res.json({
        message: `No products found in category: ${categoryName}`
      });
    }
    else {
      //console.log(fields);
      res.status(200).json({
        count: results.length,
        products: results
      });
    }
  })
});

module.exports = router;
