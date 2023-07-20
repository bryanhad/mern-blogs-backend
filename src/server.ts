import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import {rootRouter} from './routes/root.js'
import { fileURLToPath } from 'url'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3500
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// listener
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))