import dotenv from 'dotenv'
import {model, Schema} from 'mongoose'
import {SaveURL, ReadURL} from '../interface/URL'

dotenv.config()
const dbCollection = process.env.MONGODB_COLLECTION_URL || ''

const URLSchema = new Schema<SaveURL>(
    {
        URL: {
            type: String,
            required: true
        },
        images: {
            type: Array<String>,
            required: false
        },
        isDownloaded: {
            type: String,
            required: false
        }
    },{
        timestamps: true
})

const URLModel = model<SaveURL>(dbCollection, URLSchema)

export default URLModel