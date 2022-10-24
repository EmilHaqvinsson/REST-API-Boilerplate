import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import StatusCode from '../utils/StatusCode'
import MorganMiddleware from './MorganMiddleware'
import passport from 'passport'
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'

dotenv.config()
const env = process.env.NODE_ENV || 'production'

// Middlewares
const allowedOrigins = ['http://localhost:3000', 'http://192.168.2.158:3000']
const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']

const options: cors.CorsOptions = {
	origin: allowedOrigins,
	methods: allowedMethods
}

const jwtOptions: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.TOKEN_SECRET || 'secretToken'
}

// const jwtStrategy = new Strategy(jwtOptions, (payload, next) => {
// 	console.log('payload:', payload)
// 	next(null, payload)
// })

// const passportMiddleware = (passport: any) => {
// 	passport.initialize()
// 	passport.use('jwt', jwtStrategy)
// }

const applyMiddlewares = (app: express.Application) => {
	app.use(cors(options))
	app.use(helmet())
	app.use(MorganMiddleware)
	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))
	app.use(passport.initialize())
	// app.use(passport.session())

	passport.authenticate('jwt', { session: false })
	passport.use(new Strategy(jwtOptions, (payload, next) => {
		console.log('payload:', payload)
		next(null, payload)
	}))
}

// Own made middlewares
const notFound = (req: { originalUrl: any }, res: { status: (arg0: number) => void }, next: (arg0: Error) => void) => {
	console.log(req.originalUrl)
	const error = new Error(`Not Found: ${req.originalUrl}`)
	res.status(StatusCode.NOT_FOUND)
	next(error)
}

const errorHandler = (error: any, req: any, res: any, next: any) => {
	const statusCode = res.statusCode === 200 ? StatusCode.NOT_FOUND : res.statusCode
	res.status(statusCode)
	res.json({
		statusCode,
		message: error.message,
		stackTrace: env === 'development' ? error.stack : 'lol'
	})
	next(error)
}

const errorHandlerAndNotFound = (app: express.Application) => {
	app.use(notFound)
	app.use(errorHandler)
}

export default {
	applyMiddlewares,
	errorHandlerAndNotFound
}