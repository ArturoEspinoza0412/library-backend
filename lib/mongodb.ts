import config from "config";
import mongoose from "mongoose";
import logger from "./logger";


export default class MongoConn{
    mongoConn: mongoose.Connection
    private static _instance: MongoConn

    constructor() {
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
        mongoose.set('strictQuery', false);
        mongoose.set('bufferCommands', true)
        try {
            await mongoose.connect(
                `${config.get("mongodb.url")}/${config.get("mongodb.database")}`,
                config.get("mongodb.options")
            );
            logger.info(
                `Connected to the database ${config.get("mongodb.database")}`
            );
        } catch (error) {
            logger.error(error);
        }
    }

    public async disconnect() {
        mongoose.disconnect()
        logger.info("Disconnected from MongoDB")
    }
}