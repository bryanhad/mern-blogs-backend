import express from 'express'
import usersControllers from '../controllers/usersControllers.js'

const usersRoutes = express.Router()

usersRoutes.route('/')
    .get(usersControllers.getAllUsers)
    .post(usersControllers.createNewUser)
    .patch(usersControllers.updateUser)
    .delete(usersControllers.deleteUser)

export default usersRoutes