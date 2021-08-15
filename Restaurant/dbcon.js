// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    multipleStatements : true,
    connectionLimit : 10,
    host            : '[insert_MySQL_host]',
    user            : '[user_name]',
    password        : '[password]',
    database        : '[database]'
})

// Export it for use in our application
module.exports.pool = pool;
