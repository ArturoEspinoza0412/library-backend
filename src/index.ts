import Server from './class/server.class';
import cors from 'cors';
import express from 'express';
import routes from './routes';

async function configureServer() {
    const server = Server.getInstance();

    server.getApp().enable('trust proxy');

    server.getApp().use(express.urlencoded({ extended: true, limit: '50mb' }));
    server.getApp().use(express.json({ limit: '50mb' }));
    server.getApp().use(cors({ origin: true, credentials: true }));
    server.getApp().use('/api', routes)


    try {
        await server.start();
    } catch (error) {
        console.error(`Error starting server: ${error}`);
        process.exit(1);
    }
}

configureServer();
