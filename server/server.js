
require('dotenv').config()

const express = require('express')
const database = require('./libs/database')
const scraper = require('./libs/scraper')

const PORT = process.env.port || 3000


const fantasy = express()

// database.insertQuery([['name', 'username', 'email']] ,[['azim', 'azim', 'azim']], 'user')

scraper.cricbuzzWorker('22663')
fantasy.listen(PORT, ()=>{
    console.log(`Fantasy league server listening on PORT: ${PORT}`)
})

