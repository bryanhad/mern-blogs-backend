import { Request, Response, NextFunction } from 'express'
import {format} from 'date-fns'
import {v4} from 'uuid'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logEvents = async (message:string, logFileName:string) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${v4()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)        
    }
}

const logger = (req: Request, res: Response, next: NextFunction) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method}\t${req.path}`)
    next()
}

export {logEvents, logger}