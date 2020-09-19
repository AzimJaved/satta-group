const mongoose = require('mongoose')
const endpoint = "mongodb+srv://hiiambhanu:bhanu1234@cluster0.vv6km.mongodb.net/sattausers?retryWrites=true&w=majority"

mongoose.connect(endpoint, { useNewUrlParser: true, useUnifiedTopology: true  });
let connection = mongoose.connection
connection.once("open", () => {
    console.log("Connection to the database has been established")
})
.catch((err)=>console.log(err))
module.exports.connection = connection

