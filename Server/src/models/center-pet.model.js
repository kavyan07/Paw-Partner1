import mongoose from "mongoose";

const adoptionCenterPetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Pet name is required"],
        trim: true
    },
    type: {
        type: String,
        enum:{values: ['Dog', 'Cat', 'Bird', 'Fish', 'Other']},
        required: [true, "Pet type is required"],
        trim: true
    },
    breed: {
        type: String,
        required: [true, "Pet breed is required"]
    },
    age: {
        type: Number,
        required: [true, "Pet age is required"]
    },
    gender: {
        type: String,
        required: [true, "Pet gender is required"]
    },
    description: {
        type: String,
        required: [true, "Pet description is required"]
    },
    imageUrl: {
        type: String
    },
    adoptionCenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdoptionCenter",
        required: [true, "Adoption center is required"]
    }
}, { timestamps: true });

const AdoptionCenterPet = mongoose.model("AdoptionCenterPet", adoptionCenterPetSchema);

export default AdoptionCenterPet;