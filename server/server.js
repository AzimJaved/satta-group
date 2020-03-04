
require('dotenv').config()

const express = require('express')
const database = require('./libs/database')
const scraper = require('./libs/scraper')

const PORT = process.env.port || 3000


const fantasy = express()

// database.insertQuery([['name', 'username', 'email']] ,[['azim', 'azim', 'azim']], 'user')

// scraper.worker('https://www.espncricinfo.com/series/19322/scorecard/1187681/new-zealand-vs-india-5th-t20i-india-in-new-zealand-2019-20')


fantasy.listen(PORT, ()=>{
    console.log(`Fantasy league server listening on PORT: ${PORT}`)
})
