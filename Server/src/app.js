import express from "express"
import cors from "cors"
import passport from "passport"
import cookieParser from "cookie-parser"
import "./utils/passport.js"
import session from "express-session"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());

//Routes import
import userRouter from "./routes/user.routes.js"
import petRouter from "./routes/pet.routes.js"
import adoptionCenterRouter from "./routes/adoption-center.routes.js"
import petShopRouter from "./routes/pet-shop.routes.js"

//Routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/pets", petRouter)
app.use("/api/v1/adoption-center", adoptionCenterRouter)
app.use("/api/v1/pet-shop", petShopRouter)

export { app }