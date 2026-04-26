import mongoose, { Schema } from "mongoose"

const bookingSchema = new Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        customerName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        bikeId: {
            type: Schema.Types.ObjectId,
            ref: "Bike",
            required: true
        },
        bikeName: {
            type: String,
            required: true
        },
        rentalType: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
            required: true
        },
        pickupDate: {
            type: Date,
            required: true
        },
        returnDate: {
            type: Date,
            required: true
        },
        pickupLocation: {
            type: String,
            required: true,
            trim: true
        },
        gear: {
            helmet:    { type: Boolean, default: false },
            jacket:    { type: Boolean, default: false },
            gloves:    { type: Boolean, default: false },
            saddleBag: { type: Boolean, default: false }
        },
        specialRequests: {
            type: String,
            trim: true
        },
        totalAmount: {
            type: Number
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

export const Booking = mongoose.model("Booking", bookingSchema)
