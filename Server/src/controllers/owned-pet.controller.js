import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OwnedPet } from "../models/owned-pet.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { unlink } from "node:fs/promises";


const addOwnedPet = asyncHandler(async (req, res) => {
    const { name, type, breed, age, gender, description } = req.body;
    const owner = req.user._id;
    if(!req.file) {
        throw new ApiError(400, "Please upload a image file");
    }
    if (!req.user) {
        throw new ApiError(401, "Unauthorized - User not authenticated");
    }
    if (!name || !type || !breed || !age || !gender || !description) {
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

    const pet = await OwnedPet.create({
        name,
        type,
        breed,
        age,
        gender,
        description,
        imageUrl: imageUrl,
        owner
    });

    return res.status(201).json(
        new ApiResponse(201, pet, "Pet added successfully")
    );
});

const updateOwnedPet = asyncHandler(async (req, res) => {
    const { name, type, breed, age, gender, description } = req.body;
    const petId = req.params._id;
    //console.log(req.body, petId);
    const pet = await OwnedPet.findById(petId);
    if (!pet) {
        throw new ApiError(404, "Pet not found");
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }
    
    if(req.file) {
        const imageUrl = await uploadOnCloudinary(req.file.path);
        if(imageUrl == pet.imageUrl) {
            throw new ApiError(500, "Error uploading image to cloudinary")
        }
    }
    const updates = {};
    if (name) updates.name = name;
    if (type) updates.type = type;
    if (breed) updates.breed = breed;
    if (age) updates.age = age;
    if (gender) updates.gender = gender;
    if (description) updates.description = description;
    if (imageUrl) updates.imageUrl = imageUrl;

    const updatedPet = await OwnedPet.findByIdAndUpdate(
        petId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedPet, "Pet updated successfully")
    );
});

const getOwnedPets = asyncHandler(async (req, res) => {
    const pets = await OwnedPet.find({ owner: req.user._id });
    return res.status(200).json(
        new ApiResponse(200, pets, "Pets fetched successfully")
    );
});

const deleteOwnedPet = asyncHandler(async (req, res) => {
    const petId = req.params._id;
    const pet = await OwnedPet.findById(petId);
    if (!pet) {
        throw new ApiError(404, "Pet not found");
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await deleteFromCloudinary(pet.imageUrl);
    await OwnedPet.findByIdAndDelete(petId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Pet deleted successfully")
    );
});

export {
    addOwnedPet,
    updateOwnedPet,
    getOwnedPets,
    deleteOwnedPet
};

