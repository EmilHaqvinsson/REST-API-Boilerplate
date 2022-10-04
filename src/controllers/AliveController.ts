import StatusCode from '../utils/StatusCode'
import { Request, Response } from 'express'
import Logger from '../utils/Logger'

const aliveController = (request: Request, response: Response) => {
	const timestamp = new Date()
	Logger.info('AliveController was called at: ' + timestamp.toLocaleString())
	response.status(StatusCode.OK).json({
		timestamp: timestamp.toLocaleDateString('se-SV') + ', '  + String(timestamp.toLocaleTimeString('se-SV')),
		statusMessage: 'OK',
		message: 'Todo backend is alive and well.'
	})
}

export default {
	alive: aliveController
}