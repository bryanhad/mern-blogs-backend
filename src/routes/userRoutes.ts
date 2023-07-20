import express from 'express'
const userRoutes = express.Router()

userRoutes.route('/')
    .get()
    .post()
    .patch()
    .delete()

export {userRoutes}