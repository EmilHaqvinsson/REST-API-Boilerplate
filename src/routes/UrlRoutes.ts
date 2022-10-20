import { Express } from 'express'
import URLController from '../controllers/URLController'

const UrlRoutes = (server: Express) => {
    server.post('/parseUrl', URLController.parseUrl)
    server.post('/ocr', URLController.ocr)
    server.post('/download', URLController.downloadImage)
}

export default UrlRoutes
