import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Item } from "../models/item.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addItem = asyncHandler(async (req, res) => {
    const { name, weight, description, type } = req.body;
    const seller = req.user._id;

    if (!req.file) {
        throw new ApiError(400, "Please upload an image file");
    }

    const imageUrl = await uploadOnCloudinary(req.file.path);
    if (!imageUrl) {
        throw new ApiError(400, "Failed to upload image");
    }

    const item = await Item.create({
        name,
        weight,
        description,
        type,
        imageUrl,
        seller
    });

    res.status(201).json(
        new ApiResponse(201, item, "Item added successfully")
    );
});

const updateItem = asyncHandler(async (req, res) => {
    const itemId = req.params._id;
    const { name, weight, description, type } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    if (item.seller.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    let imageUrl = item.imageUrl;
    if(req.file) {
        imageUrl = await uploadOnCloudinary(req.file.path);
        if(imageUrl == item.imageUrl) {
            throw new ApiError(500, "Error uploading image to cloudinary")
        }
    }

    const updatedItem = await Item.findByIdAndUpdate(itemId, {
        name,
        weight,
        description,
        type,
        imageUrl
    }, { new: true });

    res.status(200).json(
        new ApiResponse(200, updatedItem, "Item updated successfully")
    );
});

const getItem = asyncHandler(async (req, res) => {
    const itemId = req.params._id;
    const item = await Item.findById(itemId).populate("seller", "shopName");
    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    res.status(200).json(
        new ApiResponse(200, item, "Item fetched successfully")
    );
});

const deleteItem = asyncHandler(async (req, res) => {
    const itemId = req.params._id;
    const item = await Item.findById(itemId);
    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    if (item.seller.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await Item.findByIdAndDelete(itemId);

    res.status(200).json(
        new ApiResponse(200, {}, "Item deleted successfully")
    );
});

const getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find().populate("seller", "shopName");
    res.status(200).json(
        new ApiResponse(200, items, "Items fetched successfully")
    );
});

export {
    addItem,
    updateItem,
    getItem,
    deleteItem,
    getAllItems
};