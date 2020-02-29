
require('dotenv').config()

const express = require('express')
const database = require('./libs/database')

const PORT = process.env.port || 3000


const fantasy = express()

database.ping();

fantasy.listen(PORT, ()=>{
    console.log(`Fantasy league server listening on PORT: ${PORT}`)
})
