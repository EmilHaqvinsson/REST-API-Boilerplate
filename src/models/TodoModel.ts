import dotenv from 'dotenv'
import {model, Schema} from 'mongoose'
import {CreateTodo, ReadTodo} from '../interface/Todo'

dotenv.config()
const dbCollection = process.env.MONGODB_COLLECTION_MESSAGE || ''

const TodoSchema = new Schema<CreateTodo>(
    {
        todo: {
            type: String,
            required: true
        },
        isDone: {
            type: Boolean,
            required: true
        },

    },{
        timestamps: true
})

const TodoModel = model<CreateTodo>(dbCollection, TodoSchema)

export default TodoModel