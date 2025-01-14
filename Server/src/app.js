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
import ownedPetRouter from "./routes/owned-pet.routes.js"
import adoptionCenterRouter from "./routes/adoption-center.routes.js"
import adoptionCenterPetRouter from "./routes/center-pet.routes.js"
import petShopRouter from "./routes/pet-shop.routes.js"

//Routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/owned-pets", ownedPetRouter)
app.use("/api/v1/adoption-centers", adoptionCenterRouter)
app.use("/api/v1/adoption-center-pets", adoptionCenterPetRouter)
app.use("/api/v1/pet-shops", petShopRouter)

export { app }