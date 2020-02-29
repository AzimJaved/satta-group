const mysql = require('mysql')

const connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
    port: 3306,
    multipleStatements: true
});


exports.query = async function (queryString) {
    connectionPool.getConnection((err, connection) => {
        if (err) {
            throw err
        }
        connection.query(queryString, (err, result, fields) => {
            connection.release()
            if (err) {
                throw err
            }
            return { result: result, fields: fields }
        })
    })
}

exports.ping = async function() {
    connectionPool.getConnection((err, connection)=>{
        if(err){
            throw err
        }
        connection.ping(function (err) {
            if (err) throw err
            console.log('Database server responded to ping');
        })
        connection.release()
    })
    

}


