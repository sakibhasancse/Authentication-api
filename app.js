const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const Dbconnect = require('./config/db')
const app = express()

if (process.env.NODE_ENV !== 'production') {

    require('dotenv').config({
        path: './config/config.env'
    })

}

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}

Dbconnect()
app.use(bodyParser.json())

const authRouter = require('./router/authrouter')
app.use('/api/', authRouter)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Page Not Found'
    })
})


const PORT = process.env.PORT
app.listen(PORT, function () {
    console.log('Sarver Running On ', PORT)
})
