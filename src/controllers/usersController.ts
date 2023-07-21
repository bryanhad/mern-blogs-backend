import {User} from '../models/User.js'
import {Note} from '../models/Note.js'
import asyncHandler from 'express-async-handler'
// the express-async-handler will help us to simplify our code! it will allow us to not use try-catch block without losing the ability to catch async errors!
import bcrypt from 'bcrypt'

// @desc Get all users
// @route GET /users
// @access Private (eventualy lol)
