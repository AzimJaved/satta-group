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


exports.query = async (queryString) => {
    /**
     * @param queryString For other queries and complex queries like joins.
     */
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

exports.insertQuery = async (data, table, database = `sattagroup`) => {

    /** 
    * @function insertQuery Performs a simple insert query 
    * @param data Array of Tuples to be inserted
    * @param table table name
    * @param database database, sattagroup by default
    */

    /*********** BUILD QUERY ***********/
    let queryString = `INSERT INTO ${database}.${table} VALUES\n`
    for (let i = 0; i < data.length; i++) {
        queryString += '('
        for (let j = 0; j < data[i].length; j++) {
            queryString += data[i][j]
            if (j != data[i].length - 1) {
                queryString += ', '
            }
        }
        queryString += ')'
        if (i != data.length - 1) {
            queryString += ',\n'
        }
    }
    queryString += ';'

    /*********** EXECUTE QUERY ***********/
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

exports.selectQuery = async (attributes, tables, where, database = 'sattagroup') => {

    /**
     * @function selectQuery Perfoms a simple select query
     * @param attributes Attributes to select, Array
     * @param tables Tables from where to select the attributes, Array
     * @param where The where clause, specified in full, String
     * @param database Optional, the database.
     */

    /*********** BUILD QUERY ***********/
    let queryString = `SELECT `
    for (let i = 0; i < attributes.length; i++) {
        queryString += attributes[i]
        if (i != attributes.length - 1) {
            queryString += ', '
        }
    }
    queryString += ' FROM '
    for (let i = 0; i < tables.length; i++) {
        queryString += `${database}.${tables[i]}`
        if (i != tables.length - 1) {
            query += ', '
        }
    }
    queryString += ` WHERE ${where};`

    /*********** EXECUTE QUERY ***********/
    connectionPool.getConnection((err, connection) => {
        if(err){
            throw err
        }
        connection.query(queryString, (err, result, fields) => {
            connection.release()
            if(err){
                throw err
            }
            return {result: result, fields: fields}
        })
    })
}

exports.ping = async () => {
    /**
     * @function ping Check the connection to the database
     */
    connectionPool.getConnection((err, connection) => {
        if (err) {
            throw err
        }
        connection.ping(function (err) {
            connection.release()
            if (err) throw err
            console.log('Database server responded to ping');
        })
    })
}


