const express = require('express');
const app = express();
const fs = require('fs');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path')
const PORT = process.env.PORT || 3000;
const cal = require('./util/calculate')
const db = require('./util/Database').database

const matchId = "PakVAfg" 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'pages')));

app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/pages/layouts',
    partialsDir: [
        __dirname + '/pages/partials'
    ]
}))

app.get('/', (req,res) => {
    res.render('index',{
        title : 'Satta Group'
    })  
})

app.post('/teams', (req,res) =>{
    let data = req.body
    db.ref(matchId +' /'+ data.name).set(data, function(error){
        if(!error){
            res.render('success', {
                title : 'Success'
            }
        )}
        else{ 
            res.send("An error occured")
            console.log(error)        
        }
    })
    
})

app.listen(PORT, () => {
    console.log("Booted")
})

