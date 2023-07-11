import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import path from 'path';
// import { fileURLToPath } from 'url';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import morgan from 'morgan';

import productRouter from './routes/productRoute.js';
import pageRouter from './routes/pageRoute.js';
import userRouter from './routes/userRoute.js';
import themeRouter from './routes/themeRoute.js';
import metricRouter from './routes/metricRoute.js';

import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/AppError.js';

import dotenv from 'dotenv';

dotenv.config();
const FE_HOSTNAME = process.env.FE_HOSTNAME || 'localhost';
const FE_PORT = process.env.FE_PORT || 3000;

const app = express();

app.use(morgan());

// set security http headers
app.use(helmet());

// limit api requests: max 500 request per IP in 1 hour
// const limiter = rateLimit({
//     max: 500,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use("/api", limiter);

app.use(cors({
    origin: `http://${FE_HOSTNAME}:${FE_PORT}`,
    credentials: true
}));

// reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanitization against nosql query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp());

// serving static files
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(`${__dirname}/public`));

// routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/pages", pageRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/themes", themeRouter);
app.use("/api/v1/metrics", metricRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);

export default app;
