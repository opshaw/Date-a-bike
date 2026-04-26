import mongoose, { Schema } from "mongoose"

const bikeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            enum: ["Royal Enfield", "Premium", "Scooter"],
            required: true
        },
        pricePerDay: {
            type: Number,
            required: true
        },
        pricePerWeek: {
            type: Number,
            required: true
        },
        pricePerMonth: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        specs: {
            engine: { type: String },
            power: { type: String },
            mileage: { type: String }
        },
        available: {
            type: Boolean,
            default: true
        },
        imageUrl: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Bike = mongoose.model("Bike", bikeSchema)
