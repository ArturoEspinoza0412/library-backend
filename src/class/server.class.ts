import http from 'http'
import express, { Application } from 'express'
import MongoConn from '../../lib/mongodb'
import logger from '../../lib/logger'

export default class Server {
    private port: number
    private httpServer: http.Server
    private static _instance: Server
    private mongodb: MongoConn
    private app: express.Application

    private constructor(app?: Application, port?: number) {
        this.port = port || 5001
        this.app = app || express()
        this.httpServer = new http.Server(this.app)
        this.mongodb = MongoConn.instance
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() )
    }

    async start(): Promise<void> {
        try {
            await this.mongodb.connectDB() // Conectar a la base de datos
            await this.httpServer.listen(this.port)
            logger.info(`Server running on port ${this.port}`)
        } catch (error) {
            logger.error(`Error starting server: ${error}`)
            throw error
        }
    }

    async stop(): Promise<void> {
        try {
            await this.mongodb.disconnect() // Desconectar de la base de datos
            await this.httpServer.close()
            logger.info(`Server stopped`)
        } catch (error) {
            logger.error(`Error stopping server: ${error}`)
            throw error
        }
    }

    getApp(): Application {
        return this.app
    }

    getServer(): http.Server {
        return this.httpServer
    }
}