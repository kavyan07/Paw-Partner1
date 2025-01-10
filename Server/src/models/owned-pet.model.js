import mongoose,{Schema} from 'mongoose';

const ownedPetSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Pet name is required"],
            trim: true
        },
        type: {
            type: String,
            enum: {values: ['Dog', 'Cat', 'Bird', 'Fish', 'Other']},
            required: [true, "Pet type is required"],
            trim: true
        },
        breed: {
            type: String,
            required: [true, "Pet breed is required"],
            trim: true
        },
        age: {
            type: Number,
            required: [true, "Pet age is required"],
            trim: true
        },
        gender: {
            type: String,
            required: [true, "Pet gender is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Pet description is required"],
            trim: true
        },
        imageUrl: {
            type: String
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Owner is required"]
        }
    },{timestamp: true}
)

const OwnedPet = mongoose.model('OwnedPet', ownedPetSchema)

export {OwnedPet}