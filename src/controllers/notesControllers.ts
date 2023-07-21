import asyncHandler from 'express-async-handler'
import Note from '../models/Note.js'
import { ObjectId } from 'mongoose'
import User from '../models/User.js'

type ReqBody_Create = {
    body: {
        user: ObjectId
        title: string
        text: string
    }
}

type ReqBody_Update = {
    body: {
        id: string
        user: ObjectId
        title: string
        text: string
        completed: boolean
    }
}

// @desc Get all notes
// @route GET /notes
// @access Private (enentualy lol)
const getAllNotes =  asyncHandler(async (req, res:any) => {
    const notes = await Note.find({}).lean()
    if (!notes || !notes.length) {
        return res.status(400).json({message: 'There no notes present :('})
    }
    // Add username of the owner to each note
    const notesWithUsername = await Promise.all(notes.map(async (note) => {
        const noteOwner = await User.findById(note.user).lean().exec()
        if (!noteOwner) {
            return res.status(500).json({message: `Owner of note "${note.title}" with ID of "${note.user}" does not exist!`})
        }
        return {...note, username: noteOwner.username}
    }))

    res.json(notesWithUsername)
})

// @desc Create a note
// @route POST /notes
// @access Private (enentualy lol)
const createNewNote =  asyncHandler(async (req:ReqBody_Create, res:any) => {
    const {user, title, text} = req.body

    // Confirm req body
    if (!user || !title || !text) {
        return res.status(400).json({message: 'All fields are required!'})
    }

    // Search for duplicate
    const duplicate = await Note.findOne({ title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({message: 'Note title has already been taken.'})
    }

    // Check if user with _id from req.body.user exists
    const owner = await User.findById(user).lean().exec()
    if (!owner) {
        return res.status(400).json({message: `There is no users with ID "${user}"!`})
    }
    
    // Create and store the new note
    const newNote = {user, title, text}
    const createdNote = await Note.create(newNote)

    if (createdNote) {
        res.status(201).json({message: 'Note successfuly created!'})
    } else {
        res.status(400).json({message: 'Invalid user data received :('})
    }
})

// @desc Update a note
// @route PATCH /notes
// @access Private (enentualy lol)
const updateNote =  asyncHandler(async (req: ReqBody_Update, res:any) => {
    const {id, user, title, text, completed} = req.body

    // Confirm Data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({message: 'All fields are required!'})
    }

    // Confirm note to update exists
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({message: 'Note not found :('})
    }

    // Check for duplicate
    const duplicate = await Note.findOne({title}).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Note title has already been taken!'})
    }

    // Check if user with _id from req.body.user exists
    const owner = await User.findById(user).lean().exec()
    if (!owner) {
        return res.status(400).json({message: `There is no users with ID "${user}"!`})
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json({message: `Note with title ${updatedNote.title} successfuly updated!`})
})

// @desc Delete a note
// @route DELETE /notes
// @access Private (enentualy lol)
const deleteNote =  asyncHandler(async (req, res:any) => {
    const {id} = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({message: 'Note ID is required!'})
    }

    // Confir note tp delete exists
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({message: 'Note not found :('})
    }

    const result = await note.deleteOne()

    const reply = `Note "${result.title}" with ID "${result._id}" successfuly deleted`

    res.json({message: reply})
})

export default {getAllNotes, createNewNote, updateNote, deleteNote}