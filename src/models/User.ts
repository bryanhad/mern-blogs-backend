import mongoose from 'mongoose'

interface IUser {
    username: string
    password: string
    roles: string[]
    active: boolean
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        required: true
    }],
    active: {
        type: Boolean,
        default: true
    }
})

export default mongoose.model<IUser>('User', userSchema)
