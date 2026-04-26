import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Bike } from "../models/bike.model.js"

const getAllBikes = asyncHandler(async (req, res) => {
    const bikes = await Bike.find({ available: true })
    return res.status(200).json(
        new ApiResponse(200, bikes, "Bikes fetched successfully")
    )
})

const getBikeById = asyncHandler(async (req, res) => {
    const bike = await Bike.findById(req.params.id)
    if (!bike) {
        return res.status(404).json(
            new ApiError(404, "Bike not found")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, bike, "Bike fetched successfully")
    )
})

const seedBikes = asyncHandler(async (req, res) => {
    const count = await Bike.countDocuments()
    if (count > 0) {
        return res.status(200).json(
            new ApiResponse(200, null, "Bikes collection already seeded")
        )
    }

    const bikes = [
        {
            name: "Royal Enfield Classic 350",
            category: "Royal Enfield",
            pricePerDay: 1200,
            pricePerWeek: 7000,
            pricePerMonth: 22000
        },
        {
            name: "Royal Enfield Meteor 350",
            category: "Royal Enfield",
            pricePerDay: 1400,
            pricePerWeek: 8500,
            pricePerMonth: 26000
        },
        {
            name: "Royal Enfield Himalayan 411",
            category: "Royal Enfield",
            pricePerDay: 1600,
            pricePerWeek: 10000,
            pricePerMonth: 30000
        },
        {
            name: "Royal Enfield Himalayan 450",
            category: "Royal Enfield",
            pricePerDay: 1800,
            pricePerWeek: 11000,
            pricePerMonth: 34000
        },
        {
            name: "Royal Enfield Interceptor 650",
            category: "Premium",
            pricePerDay: 2200,
            pricePerWeek: 14000,
            pricePerMonth: 42000
        },
        {
            name: "Honda Activa",
            category: "Scooter",
            pricePerDay: 600,
            pricePerWeek: 3500,
            pricePerMonth: 10000
        }
    ]

    const inserted = await Bike.insertMany(bikes)
    return res.status(201).json(
        new ApiResponse(201, inserted, "Bikes seeded successfully")
    )
})

export { getAllBikes, getBikeById, seedBikes }
