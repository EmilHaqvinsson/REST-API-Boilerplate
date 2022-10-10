import dotenv from 'dotenv'
import { Express } from 'express'
import { connect } from 'mongoose'
import Logger from '../utils/Logger'

dotenv.config()

const PORT: number = Number(process.env.SERVER_PORT) || 3001
const env: string = process.env.NODE_ENV || 'production'

const uri = process.env.MONGODB_URL || 'mongodb://localhost'
const dbName = process.env.MONGODB_NAME || 'todo'
const connectToDatabase = async () => {
	try {
		await connect(uri)
		Logger.info(`📈 Successfully connected to MongoDB at ${uri} 📈`)
	} catch (error) {
		Logger.error('🛑 Error connecting to the database:'.toUpperCase(), error, ' 🛑')
		process.exit()
	}
}

const connectToPort = (server: Express) => {
	server.listen(PORT, () => {
		Logger.info(`🌐 Server is running at http://localhost:${ PORT } 🌐`)
		if (env === 'development') {
			Logger.warn('🛑 Server running in development mode! 🛑'.toUpperCase())
		} else {
			Logger.info('✅ Server running in production mode! ✅'.toUpperCase())
		}
	})
}

export default {
	connectToDatabase,
	connectToPort
}