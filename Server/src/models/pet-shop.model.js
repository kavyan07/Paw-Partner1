import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const shopSchema = new Schema(
    {
        shopName: {
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
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: 'Shop:: {VALUE} is not a valid email!'
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
            enum: ["customer", "shop owner", "veterinarian", "admin"],
            default: "customer"
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

shopSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

shopSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

shopSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            shopName: this.shopName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
shopSchema.methods.generateRefreshToken = function(){
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

const tempShopSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    shopName: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    contact: {
        type: String
    },
    role: {
        type: String,
        enum: ["customer"],
        default: "customer"
    },
    otp: {
        type: String, 
        required: true
    },
    otpExpiry: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000)
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 
    }
});

const TempShop = mongoose.model('TempShop', tempShopSchema)
const Shop = mongoose.model("Shop", shopSchema)

export{ Shop, TempShop }