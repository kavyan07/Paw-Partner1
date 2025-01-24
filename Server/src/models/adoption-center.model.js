import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adoptionCenterSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
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
        adoptionCenterName: {
            type: String,
            unique: true,
            required: [true, "Adoption center name is required"],
            index: true
        },
        adoptionCenterDescription: {
            type: String,
            required: [true, "Adoption center description is required"]
        },
        imageUrl: {
            type: String,
            default: "https://res.cloudinary.com/dd2y1lxsf/image/upload/v1737739026/shop_default_axzvoi.jpg"
        },
        role: {
            type: String,
            enum: ["adoptionCenter"],
            default: "adoptionCenter"
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

adoptionCenterSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adoptionCenterSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

adoptionCenterSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            adoptionCenterName: this.adoptionCenterName,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

adoptionCenterSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

const tempAdoptionCenterSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
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
    adoptionCenterName: {
        type: String
    },
    adoptionCenterDescription: {
        type: String
    },
    photo: {
        type: String,
        default: "https://example.com/default-adoption-center-photo.jpg"
    },
    role: {
        type: String,
        enum: ["adoptionCenter"],
        default: "adoptionCenter"
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

const TempAdoptionCenter = mongoose.model('TempAdoptionCenter', tempAdoptionCenterSchema);
const AdoptionCenter = mongoose.model("AdoptionCenter", adoptionCenterSchema);

export { AdoptionCenter, TempAdoptionCenter };