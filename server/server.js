
require('dotenv').config()
const express = require('express')
const database = require('./libs/database')
const scraper = require('./libs/scraper')
const bodyParser = require('body-parser')
const crypto = require('crypto-js')
const cors = require('cors')

const connection = require('./libs/mongo')
const { Auth } = require('./libs/auth')

const PORT = process.env.port || 8000

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())
app.options('*', cors())

const { firebaseAuth } = require('./libs/firebase')


// database.insertQuery([['name', 'username', 'email']] ,[['azim', 'azim', 'azim']], 'user')


app.post('/login', (req, res) => {
    let time = Date()
    // console.log(req.body);
    console.log(req.body.email + " " + req.body.password)
    firebaseAuth.signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(() => {
            let token = crypto.MD5('/AzIm/' + req.body.email + '*' + req.body.password + '*' + time.toString() + '/AyEsha/').toString()
            let authToken = new Auth({ token: token, date: time, valid: true })
            authToken.save()
                .then(savedToken => {
                    console.log("New login detected")
                    Auth.find({}, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.json({ authenticated: false, token: null })
                            return
                        }
                    })
                    res.json({ authenticated: true, token: token })
                    return
                })
                .catch((err) => {
                    console.log(err)
                    console.log("Database save failed")
                    res.json({ authenticated: false, token: null })
                    return
                })
        })
        .catch(() => {
            console.log("Sign in failed")
            res.json({ authenticated: false, token: null })
            return
        })
})




scraper.cricbuzzWorker('22663')
app.listen(PORT, ()=>{
    console.log(`app league server listening on PORT: ${PORT}`)
})

