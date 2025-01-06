import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Pet } from "../models/pet.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { unlink } from "node:fs/promises";


const addPet = asyncHandler(async (req, res) => {
    const { petName, petType, breed, age, gender, description } = req.body;
    if(!req.file) {
        throw new ApiError(400, "Please upload a image file");
    }
    if (!req.user) {
        throw new ApiError(401, "Unauthorized - User not authenticated");
    }
    const owner = req.user._id;
    if (!petName || !petType || !breed || !age || !gender || !description) {
        throw new ApiError(400, "All fields are required");
    }
    // Add file size validation
    if(req.file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new ApiError(400, "Image size should be less than 5MB");
    }
    const imageUrl = await uploadOnCloudinary(req.file.path);
    if(!imageUrl) {
        throw new ApiError(400, "Failed to upload image");
    }

    const pet = await Pet.create({
        petName,
        petType,
        breed,
        age,
        gender,
        description,
        image: imageUrl,
        owner
    });

    return res.status(201).json(
        new ApiResponse(201, pet, "Pet added successfully")
    );
});

const updatePet = asyncHandler(async (req, res) => {
    const { petName, petType, breed, age, gender, description } = req.body;
    const petId = req.params._id;

    const pet = await Pet.findById(petId);
    if (!pet) {
        throw new ApiError(404, "Pet not found");
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    const updatedPet = await Pet.findByIdAndUpdate(petId, {
        petName,
        petType,
        breed,
        age,
        gender,
        description
    }, { new: true });

    return res.status(200).json(
        new ApiResponse(200, updatedPet, "Pet updated successfully")
    );
});

const getPets = asyncHandler(async (req, res) => {
    const pets = await Pet.find({ owner: req.user._id });
    return res.status(200).json(
        new ApiResponse(200, pets, "Pets fetched successfully")
    );
});

const deletePet = asyncHandler(async (req, res) => {
    const petId = req.params._id;
    const pet = await Pet.findById(petId);
    if (!pet) {
        throw new ApiError(404, "Pet not found");
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await Pet.findByIdAndDelete(petId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Pet deleted successfully")
    );
});

export { addPet, updatePet, getPets, deletePet };

