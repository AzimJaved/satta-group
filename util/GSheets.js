const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const LoadBalancer = require('./LoadBalancer');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CREDENTIALS_PATH = './util/GoogleAPIs/Sheets/credentials.json';
const TOKEN_PATH = './util/GoogleAPIs/Sheets/token.json';

function authorize() {
    return new Promise((resolve,reject)=>{
        fs.readFile(CREDENTIALS_PATH, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err)
            let credentials = JSON.parse(content)
            const {client_secret, client_id, redirect_uris} = credentials.installed
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
            
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    getNewToken(oAuth2Client).then((auth)=>{
                        resolve(auth)
                    })
                } else {
                    oAuth2Client.setCredentials(JSON.parse(token))
                    resolve(oAuth2Client)
                }
            })
        })
    })
}

function getNewToken(oAuth2Client) {
    return new Promise((resolve,reject)=>{
        const rlx = readline.createInterface({ input: process.stdin, output: process.stdout })
        rlx.question('Invalid or no token found. Generate new? (Y/N)...', (code) => {
            if(code=='Y'||code=='y') {
                const authUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: SCOPES,
                })
                console.log('Authorization URL:', authUrl)
                const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
                rl.question('Validation code: ', (code) => {
                    rl.close()
                    oAuth2Client.getToken(code, (err, token) => {
                        if (err) return console.error('Error retrieving access token', err)
                        oAuth2Client.setCredentials(token)
                        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                            if (err) return reject(err)
                            console.log('Token stored to', TOKEN_PATH)
                            resolve(oAuth2Client)
                        })
                    })
                })
            }
        })
    })    
}

exports.TestGSheets = function() {
    return new Promise((resolve,reject)=>{
        authorize().then((auth)=>{
            try {
                let testObj = google.sheets({version: 'v4', auth})
                if (testObj!=null) resolve({ success: true })
            } catch(err) {
                resolve({ success: false, errors: err })
            }
        }).catch((err)=>{
            reject(err)
        })
    })
}

// ================================================== //

exports.AppendToSpreadsheet = function (payload) {
    return new Promise((resolve,reject)=>{
        let results = [], errors = []
        authorize().then((auth)=>{
            payload.forEach(entry => {
                google.sheets({version: 'v4', auth}).spreadsheets.values.append({
                    spreadsheetId: entry.ssId,
                    
                    range: entry.sheet,
                    valueInputOption: 'RAW',
                    insertDataOption: 'INSERT_ROWS',
                    
                    resource: {
                        majorDimension: "ROWS",
                        values: [entry.values]
                    },
                    auth: auth
                }, function(err, response) {
                    if (!err) {
                        results = [...results, response]
                        console.log("Spreadsheet Payload Delivered")
                    }
                    else {
                        errors = [...errors, err]
                        console.log(errors)
                    }
                }) 
            })
            resolve(results, errors)
        }).catch((err)=>{
            reject(err)
        })
    })
}

exports.WriteToSpreadsheet = function (payload) {
    
}