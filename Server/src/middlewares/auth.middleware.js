import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { AdoptionCenter } from "../models/adoption-center.model.js";
import { Shop } from "../models/pet-shop.model.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Check if the token is in the correct format
        if (token.split('.').length !== 3) {
            console.error("Malformed Token:", token); // Log the malformed token
            throw new ApiError(401, "jwt malformed");
        }

        console.log("Token:", token); // Log the token

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check in all datasets for the user
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        const adoptionCenter = await AdoptionCenter.findById(decodedToken?._id).select("-password -refreshToken");
        const petShop = await Shop.findById(decodedToken?._id).select("-password -refreshToken");
        
        const authenticatedEntity = user || adoptionCenter || petShop;

        if (!authenticatedEntity) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Assign the found entity to req.user
        req.user = authenticatedEntity;
        next();
    } catch (error) {
        console.error("JWT Error:", error); // Log the error
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

const checkRole = (roles) => {
    return asyncHandler(async (req, _, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden");
        }
        next();
    });
}

export { verifyJWT, checkRole };