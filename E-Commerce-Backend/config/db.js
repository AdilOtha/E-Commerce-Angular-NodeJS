var mysql = require('mysql');
const db = mysql.createConnection({
    host: 'sql12.freemysqlhosting.net',
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