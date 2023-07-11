import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception! Shutting down...');
    process.exit(1);
});

dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_HOST = process.env.DB_HOST || 'db';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

// const CONNECTION_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@ourstore.toyjjza.mongodb.net/ourstore?retryWrites=true&w=majority`;
// const CONNECTION_URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/ourstore?retryWrites=true&w=majority`;
const CONNECTION_URL = `mongodb://${DB_HOST}:${DB_PORT}/ourstore?retryWrites=true&w=majority`;

mongoose.set('strictQuery', true);
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true })
    .then(() => console.log('DB connection is successful'))

const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection! Shutting down...');
    server.close(() => {
        process.exit(1);
    });
})
