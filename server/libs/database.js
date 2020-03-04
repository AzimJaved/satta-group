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

/**
 * @function query All SQL queries
 * @param queryString For other queries and complex queries like joins.
*/
exports.query = async (queryString) => {
    connectionPool.getConnection((err, connection) => {
        if (err) {
            throw err
        }
        connection.query(queryString, (err, result, fields) => {
            connection.release()
            if (err) {
                throw err
            }
            return Promise.resolve({ result: result, fields: fields })
        })
    })
}

/** 
 * @function insertQuery Performs a simple insert query 
 * @param columns Columns being inserted (Double Array)
 * @param data Array of Tuples to be inserted (Double Array)
 * @param table table name
 * @param database database, sattagroup by default
*/

exports.insertQuery = async (columns, data, table, database = `sattagroup`) => {



    /*********** BUILD QUERY ***********/
    let queryString = `INSERT INTO ${database}.${table} `
    for (let i = 0; i < columns.length; i++) {
        queryString += '('
        for (let j = 0; j < columns[i].length; j++) {
            queryString += columns[i][j]
            if (j != columns[i].length - 1) {
                queryString += ', '
            }
        }
    }
    queryString += ') VALUES \n'
    for (let i = 0; i < data.length; i++) {
        queryString += '('
        for (let j = 0; j < data[i].length; j++) {
            queryString += `'${data[i][j]}'`
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
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            }
            connection.query(queryString, (err, result, fields) => {
                connection.release()
                if (err) {
                    reject(err)
                }
                resolve({ result: result, fields: fields })
            })
        })
    })
}

/**
 * @function selectQuery Perfoms a simple select query
 * @param attributes Attributes to select, Array
 * @param tables Tables from where to select the attributes, Array
 * @param where The where clause, specified in full, String
 * @param database Optional, the database.
 */

exports.selectQuery = async (attributes, tables, where, database = 'sattagroup') => {


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
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            }
            connection.query(queryString, (err, result, fields) => {
                connection.release()
                if (err) {
                    reject(err)
                }
                resolve({ result: result, fields: fields })
            })
        })
    })
}

/**
 * @function ping Check the connection to the database
*/
exports.ping = async () => {

    connectionPool.getConnection((err, connection) => {
        if (err) {
            reject(err)
        }
        connection.ping(function (err) {
            connection.release()
            if (err) reject(err)
            console.log('Database server responded to ping');
        })
    })
}


