const express = require('express')
const app = express();

const cors = require("cors")
const bodyParser  = require('body-parser');
const cookieParser = require('cookie-parser');
const connectMongoDB = require("./config/db");
const userRouter = require('./routes/user.route');
const taskRoute = require('./routes/task.route');
const userTypeRoute = require('./routes/usertype.route');

const errorHandlerMiddleWare = require('./middleware/error');

// app.set('trust proxy', 1) 
app.use(cors({
    // origin: `http://localhost:${process.env.PORT}`,
    // methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    // credentials: true,
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

connectMongoDB()

app.use("/api/v1", userRouter)
app.use("/api/v1/task", taskRoute)
app.use("/api/v1", userTypeRoute)

app.use("*", (req, res, next) => {
    const err = new Error(`Requested URL ${req.path} not found`)
    err.statusCode = 404;
    next(err)
})

app.use(errorHandlerMiddleWare)

module.exports = app