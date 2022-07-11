const mongoose = require("mongoose");
const dotenv = require("dotenv");
const NODE_ENV = 'dev';

if(NODE_ENV === 'dev') {
    dotenv.config({path: './config/dev.config.env'})
}
else {
    dotenv.config({path: './config/prod.config.env'})    
}
const { DBURI, DBHOST, DBPORT, DBNAME } = process.env

function connectMongoDB() {       
    mongoose.connect(DBURI+DBHOST+':'+DBPORT+'/'+DBNAME)

    mongoose.connection.on('open', () => {
        console.log(`Mongoose default connection open`);
    })

    mongoose.connection.on('connected', () => {
        console.log(`Database connected with db ${DBNAME}`)
    })

    mongoose.connection.on('error', (err) => {
        console.log(`Mongoose connection err ${err}`);
    })

    mongoose.connection.on('disconnected', () => {
        console.log(`Mongoose connection disconnected`);
    })    
}

module.exports = connectMongoDB