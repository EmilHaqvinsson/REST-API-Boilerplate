import express from 'express'
import Configuration from './configurations/Configuration'
import Middleware from './middlewares/Middleware'
import AliveRoutes from './routes/AliveRoutes'
import Logger from './utils/Logger'
import TodoRoutes from './routes/TodoRoutes'

const server = express()
Middleware.applyMiddlewares(server)

// Routes
AliveRoutes(server)
TodoRoutes(server)

Middleware.errorHandlerAndNotFound(server)

Configuration.connectToPort(server)
Configuration.connectToDatabase().then(() => {
    Logger.info('🚀 Portfolio backend is running... 🚀')
})

export default server