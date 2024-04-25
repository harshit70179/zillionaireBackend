const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
const { table } = require("./table.js");

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  post: dbConfig.PORT
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
  function createTable(query) {
    const createTableSQL = query

    connection.query(createTableSQL, (err) => {
      if (err) {
        console.error(`Error creating  table:`, err);
      } else {
        console.log(`table created successfully`);
      }
    });
  }
  const userInsert = () => {

    const query = "INSERT INTO `user` (`user_name`,`email`, `password`,`user_type`) VALUES ('Admin','admin@gmail.com', '$2a$10$4X0Vbh0SG2SZ9QnWoD67Muf/hFHO0nG31N7lbBnSwe39ZwF9lsYZK', '1');"
    const checkAdmin = "SELECT * FROM user WHERE email='admin@gmail.com'"
    connection.query(checkAdmin, (err, result) => {
      if (err) {
      } else {
        if (result.length == 0) {
          connection.query(query, (err, result) => {
            if (err) {
            } else {
              console.log('Data inserted successfully');
            }
          });
        }

      }
    });
  }



  table.forEach((e) => {
    const checkTableSQL = `SHOW TABLES LIKE '${e.tableName}'`;

    connection.query(checkTableSQL, (err, results) => {
      if (err) {
        console.error(`Error checking ${e.tableName} table:`, err);
      } else {
        if (results.length === 0) {
          createTable(e.query);
        } else {
          console.log(`${e.tableName} table already exists`);
          userInsert()
        }
      }
    });
  });

});


module.exports = connection;