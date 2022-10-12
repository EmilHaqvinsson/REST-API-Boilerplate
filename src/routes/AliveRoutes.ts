import {Express} from 'express'
import AliveController from '../controllers/AliveController'
// import URLController from '../controllers/URLController'

const AliveRoutes = (server: Express) => {
    server.get('/', AliveController.alive)
}



export {
    AliveRoutes
}