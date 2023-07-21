import express from 'express'
import notesControllers from '../controllers/notesControllers.js'

const notesRoutes = express.Router()

notesRoutes.route('/')
    .get(notesControllers.getAllNotes)
    .post(notesControllers.createNewNote)
    .patch(notesControllers.updateNote)
    .delete(notesControllers.deleteNote)

export default notesRoutes