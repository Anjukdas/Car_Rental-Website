import express from 'express';
import UserRouter from "./routes/userRoutes.js"

import cors from "cors"


const app = express();

// middlewares
app.use(express.json())
app.use(cors())

app.use('/users', UserRouter)
export default app;