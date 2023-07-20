//@ts-nocheck
import mongoose, { ObjectId } from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose)

interface INote {
   user: ObjectId
   title: string
   text: string
   completed: boolean
}

const noteSchema = new mongoose.Schema<INote>(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User',
      },
      title: {
         type: String,
         required: true,
      },
      text: {
         type: String,
         required: true,
      },
      completed: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
)

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

export const User = mongoose.model<INote>('User', noteSchema)
