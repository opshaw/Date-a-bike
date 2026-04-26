import express from "express"
import cors from "cors" //Cross Origin Resource Sharing
import cookieParser from "cookie-parser" //Used to Access and Set Cookie in User Browser
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//app.use(express.something) //To set express configuration
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// app.use(express.static("public"))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())

//Importing Routes
import userRouter from "./routes/user.routes.js"
import bikeRouter from "./routes/bike.routes.js"
import bookingRouter from "./routes/booking.routes.js"
//Routes Declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/bikes",bikeRouter)
app.use("/api/v1/bookings",bookingRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        statusCode,
        message: err.message || "Internal Server Error",
        success: false
    })
})

export {app}