import dotenv from 'dotenv'
import { model, Schema } from 'mongoose'
import { CreateUser } from '../interface/User'

dotenv.config()
const dbCollection = process.env.MONGODB_COLLECTION_USERS || ''

const UserSchema = new Schema<CreateUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

const UserModel = model<CreateUser>(dbCollection, UserSchema)

export default UserModel