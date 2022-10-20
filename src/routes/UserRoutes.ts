import { Express } from 'express'
import UserController from '../controllers/UserController'

const UserRoutes = (server: Express) => {
    server.get('/users', UserController.getAllUsers)
    server.post('/user', UserController.register)
    server.post('/login', UserController.login)
    server.get('/profile/:username', UserController.getUserByUsername)
}

export {
    UserRoutes
}