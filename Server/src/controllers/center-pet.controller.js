import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AdoptionCenterPet } from "../models/center-pet.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addAdoptionCenterPet = asyncHandler(async (req, res) => {
    const { name, type, breed, age, gender, description } = req.body;
    const adoptionCenter = req.user._id;
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

    const pet = await AdoptionCenterPet.create({
        name,
        type,
        breed,
        age,
        gender,
        description,
        imageUrl: imageUrl,
        adoptionCenter
    });

    res.status(201).json(
        new ApiResponse(201, pet, "Pet added successfully")
    );
});

const updateAdoptionCenterPet = asyncHandler(async (req, res) => {
    const petId = req.params._id;
    const { name, type, breed, age, gender, description } = req.body;

    const pet = await AdoptionCenterPet.findById(petId);
    if (!pet) {
        throw new ApiError(404, "Pet not found");
    }

    if (pet.adoptionCenter.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    if(req.file) {
        const imageUrl = await uploadOnCloudinary(req.file.path);
        if(imageUrl == pet.imageUrl) {
            throw new ApiError(500, "Error uploading image to cloudinary")
        }
    }

    const updatedPet = await AdoptionCenterPet.findByIdAndUpdate(petId, {
        name,
        type,
        breed,
        age,
        gender,
        description,
        imageUrl: imageUrl
    }, { new: true });

    res.status(200).json(
        new ApiResponse(200, updatedPet, "Pet updated successfully")
    );
});

const getAdoptionCenterPets = asyncHandler(async (req, res) => {
    const centerId = req.params._id;
    const pets = await AdoptionCenterPet.find({ adoptionCenter: centerId });
    return res.status(200).json(
        new ApiResponse(200, pets, "Pets fetched successfully")
    );
});

const deleteAdoptionCenterPet = asyncHandler(async (req, res) => {
    const petId = req.params._id;
    const pet = await AdoptionCenterPet.findById(petId);
    if (!pet) {
        throw new ApiError(404, "Pet not found");
    }

    if (pet.adoptionCenter.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await AdoptionCenterPet.findByIdAndDelete(petId);

    res.status(200).json(
        new ApiResponse(200, {}, "Pet deleted successfully")
    );
});

export {
    addAdoptionCenterPet,
    updateAdoptionCenterPet,
    getAdoptionCenterPets,
    deleteAdoptionCenterPet
};