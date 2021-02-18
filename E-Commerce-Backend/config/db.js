var mysql = require('mysql');
const db = mysql.createConnection({
    host: 'johnny.heliohost.org',
    user: 'adilotha_5897',
    password: 'ozymandias5897',
    database: 'adilotha_ecomm_app'
  });
  
  // connect to database
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to database');
  });

  module.exports=db;