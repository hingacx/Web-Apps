// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    multipleStatements : true,
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_hinga',
    password        : '3993',
    database        : 'cs340_hinga'
})

// Export it for use in our application
module.exports.pool = pool;