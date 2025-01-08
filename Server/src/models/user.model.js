import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Basic email regex
                },
                message: 'User:: {VALUE} is not a valid email!'
            }
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        address: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "shop owner", "adoption center", "admin"],
            default: "user"
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const tempUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    otp: {
        type: String, 
        required: true
    },
    otpExpiry: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 
    }
});

const TempUser = mongoose.model('TempUser', tempUserSchema)
const User = mongoose.model("User", userSchema)

export{ User, TempUser }