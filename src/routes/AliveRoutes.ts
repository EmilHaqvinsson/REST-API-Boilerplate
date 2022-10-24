import { Express } from 'express'
import AliveController from '../controllers/AliveController'
import NoteController from '../controllers/NoteController'
import UserController from '../controllers/UserController'
import passport from 'passport'
import passportMiddleware from '../middlewares/Middleware'
// import URLController from '../controllers/URLController'

const AliveRoutes = (server: Express) => {
    server.get('/', AliveController.alive)
}

const UserRoutes = (server: Express) => {
    server.get('/users', UserController.getAllUsers)
    server.post('/user', UserController.register)
    server.post('/login', UserController.login)
    server.get('/profile/:username', UserController.getUserByUsername)
}

const NoteRoutes = (server: Express) => {
    server.get('/notes', NoteController.getAllNotes)
    server.get('/notes/tags', NoteController.getListOfTags)
    server.post('/note', NoteController.addNote)
    server.get('/note/:id', NoteController.getNoteById)
    // server.put('/note/:id', NoteController.updateNoteById)
    // server.delete('/note/:id', NoteController.deleteNoteById)
}

export {
    AliveRoutes,
    UserRoutes,
    NoteRoutes
}