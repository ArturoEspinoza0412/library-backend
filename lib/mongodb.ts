import config from "config"
import mongoose from "mongoose"
import logger from "./logger"

export default class MongoConn {
    private static _instance: MongoConn
    private mongoConn: mongoose.Connection

    private constructor() {
        this.connectDB()
        this.mongoConn = mongoose.connection
    }

    public static get instance() {
        return this._instance || (this._instance = new this())
    }

    public get getConnection() {
        return this.mongoConn
    }

    public async connectDB() {
        mongoose.set('strictQuery', false)
        mongoose.set('bufferCommands', true)
        
        try {
            await mongoose.connect(
                `${config.get("mongodb.url")}/${config.get("mongodb.database")}`,
                config.get("mongodb.options")
            )
            logger.info(`Connected to the database ${config.get("mongodb.database")}`)
        } catch (error: any) {
            logger.error(error)
            throw new Error(`Failed to connect to MongoDB: ${error.message}`)
        }

        this.mongoConn.on('error', (err: any) => {
            logger.error(`MongoDB connection error: ${err}`)
        })

        this.mongoConn.on('disconnected', () => {
            logger.warn('MongoDB disconnected')
        })

        this.mongoConn.on('reconnected', () => {
            logger.info('MongoDB reconnected')
        })
    }

    public async disconnect() {
        try {
            await mongoose.disconnect()
            logger.info("Disconnected from MongoDB")
        } catch (error: any) {
            logger.error(`Error disconnecting from MongoDB: ${error}`)
        }
    }
}
