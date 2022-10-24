import dotenv from 'dotenv'
import { model, Schema } from 'mongoose'
import { CreateNote, ReadNote } from '../interface/Note'

dotenv.config()
const dbCollection = process.env.MONGODB_COLLECTION_NOTES || ''

const NoteSchema = new Schema<CreateNote>(
    {
        title: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: false
        },
        isPrivate: {
            type: Boolean,
            required: false
        },
        tags: {
            type: Array<String>(),
            required: false
        }
    }, {
    timestamps: true
})

const NoteModel = model<CreateNote>(dbCollection, NoteSchema)

export default NoteModel