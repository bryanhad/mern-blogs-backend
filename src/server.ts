import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import {rootRouter} from './routes/root.js'
import { fileURLToPath } from 'url'
import cors from 'cors'
import { logEvents, logger } from './middleware/logger.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.js'
import { corsOptions } from './config/corsOptions.js'
import { connectDB } from './config/dbConnect.js'
import mongoose, {MongooseError} from 'mongoose'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3500
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()

// third party middlewares
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
// css
app.use('/', express.static(path.join(__dirname, 'public')))

// routes
app.use('/', rootRouter)

// catch all
app.all("*", (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// error Handler (logs the error and sends an error message in response)
app.use(errorHandler)

// listener
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
})

mongoose.connection.on('error', (err) => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})