var mysql = require('mysql');
const db = mysql.createConnection({
    host: 'ec2-52-8-112-233.us-west-1.compute.amazonaws.com',
    user: 'sql12393747',
    password: 'xsvPmVbP85',
    database: 'sql12393747'
  });
  
  // connect to database
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to database');
  });

  module.exports=db;