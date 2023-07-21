import User from '../models/User.js'
import Note from '../models/Note.js'
import asyncHandler from 'express-async-handler'
// the express-async-handler will help us to simplify our code! it will allow us to not use try-catch block without losing the ability to catch async errors!
import bcrypt from 'bcrypt'

type ReqBody_Create = {
    body: {
        username: string
        password: string
        roles: string[]
    }
}

type ReqBody_Update = {
    body: {
        id: string
        username: string
        roles: string[]
        active: boolean
        password: string
    }
}

// @desc Get all users
// @route GET /users
// @access Private (eventualy lol)
const getAllUsers = asyncHandler( async (req, res:any) => {
    const users = await User.find({}).select('-password').lean() //lean method just removes the methods that comes with the document. such as save()
    if (!users || !users.length) { //if the users doesnt exist or if the users exists but there is no length
        return res.status(400).json({message: 'There are no users present :('})
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private (eventualy lol)
const createNewUser = asyncHandler( async (req:ReqBody_Create, res:any) => {
    const { username, password, roles }  = req.body

    // Cofnirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: 'All fields are required!'})
    }

    // Check for diplicates
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({message: 'Username has already been taken!'})
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // 10 salt rounds

    const newUser = {username, password:hashedPwd, roles} // check if the password is working

    // Create and store new user
    const createdUser = await User.create(newUser)

    if (createdUser) {
        res.status(201).json({message: `New user ${username} created!`})
    } else {
        res.status(400).json({message: 'Invalid user data received :('})
    }
    
})

// @desc Update a user
// @route PATCH /users
// @access Private (eventualy lol)
const updateUser = asyncHandler( async (req:ReqBody_Update, res:any) => {
    const { id, username, roles, active, password} = req.body

    // Confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({message: 'All fields are required!'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: 'User not found :('})
    }

    // Check for duplicate
    const duplicate = await User.findOne({username}).lean().exec()
    // if the duplicate's _id is not the same as the req.body{id}, then don't allow to update. cuz it means that the client is trying to update their username to already registered username used by someone else
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Username has already been taken!'})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // hash password
        user.password = await bcrypt.hash(password, 10) // 10 salt rounds
    }

    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} successfuly updated!`})
})

// @desc Delete a users
// @route DELETE /users
// @access Private (eventualy lol)
const deleteUser = asyncHandler( async (req, res:any) => {
    const {id} = req.body

    if (!id) {
        return res.status(400).json({message: 'User ID is required!'})
    }

    const note = await Note.findOne({user: id}).lean().exec()
    if (note) {
        return res.status(400).json({message: 'User has assigned notes!'})
    }

    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({message: 'User not found :('})
    }

    const result = await user.deleteOne()

    const reply = `User ${result.username} with ID "${result._id}" successfuly deleted!`

    res.json({message: reply})
})

export default {getAllUsers, createNewUser, updateUser, deleteUser}
