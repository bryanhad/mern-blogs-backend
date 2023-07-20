import { logEvents } from './logger.js'
import { ErrorRequestHandler} from 'express'


const errorHandler: ErrorRequestHandler = (err:Error, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, `errLog.log`)
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500 //check if the response already has a status code that is predefined. if not, use 500

    res.status(status)
    res.json({message: err.message})
}

export {errorHandler}