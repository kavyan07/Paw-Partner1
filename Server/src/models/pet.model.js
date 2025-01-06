import mongoose,{Schema} from 'mongoose';

const petSchema = new Schema(
    {
        petName: {
            type: String,
            required: true,
            trim: true
        },
        petType: {
            type: String,
            enum: {values: ['Dog', 'Cat', 'Bird', 'Fish', 'Other']},
            required: true,
            trim: true
        },
        breed: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true,
            trim: true
        },
        gender: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String, //cloudinary url
            required: true,
            trim: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamp: true
    }
)

const Pet = mongoose.model('Pet', petSchema)

export {Pet}