import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Booking } from "../models/booking.model.js"
import { Bike } from "../models/bike.model.js"

const createBooking = asyncHandler(async (req, res) => {
    const {
        customerName,
        email,
        phone,
        bikeId,
        rentalType,
        pickupDate,
        returnDate,
        pickupLocation,
        gear,
        specialRequests
    } = req.body

    if (
        [customerName, email, phone, bikeId, rentalType, pickupDate, returnDate, pickupLocation]
            .some((field) => !field || String(field).trim() === "")
    ) {
        return res.status(400).json(
            new ApiError(400, "customerName, email, phone, bikeId, rentalType, pickupDate, returnDate and pickupLocation are required")
        )
    }

    const bike = await Bike.findById(bikeId)
    if (!bike) {
        return res.status(404).json(
            new ApiError(404, "Bike not found")
        )
    }
    if (!bike.available) {
        return res.status(400).json(
            new ApiError(400, "Bike is not available")
        )
    }

    const conflict = await Booking.findOne({
        bikeId: bikeId,
        status: { $nin: ["cancelled"] },
        $or: [
            { pickupDate: { $lte: new Date(returnDate) }, returnDate: { $gte: new Date(pickupDate) } }
        ]
    })
    if (conflict) {
        return res.status(400).json(
            new ApiError(400, "This bike is already booked for the selected dates")
        )
    }

    const days = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000)

    let totalAmount
    if (rentalType === "daily") {
        totalAmount = days * bike.pricePerDay
    } else if (rentalType === "weekly") {
        totalAmount = Math.ceil(days / 7) * bike.pricePerWeek
    } else {
        totalAmount = Math.ceil(days / 30) * bike.pricePerMonth
    }

    const booking = await Booking.create({
        customerId: req.user?._id,
        customerName,
        email,
        phone,
        bikeId,
        bikeName: bike.name,
        rentalType,
        pickupDate,
        returnDate,
        pickupLocation,
        gear,
        specialRequests,
        totalAmount
    })

    await Bike.findByIdAndUpdate(bikeId, { available: false })

    return res.status(201).json(
        new ApiResponse(201, booking, "Booking created successfully")
    )
})

const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ email: req.user.email })
        .sort({ createdAt: -1 })
        .populate("bikeId")

    return res.status(200).json(
        new ApiResponse(200, bookings, "Bookings fetched successfully")
    )
})

const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
        .sort({ createdAt: -1 })
        .populate("bikeId")

    return res.status(200).json(
        new ApiResponse(200, bookings, "All bookings fetched successfully")
    )
})

const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
        return res.status(404).json(
            new ApiError(404, "Booking not found")
        )
    }

    if (!req.user.isAdmin && booking.email !== req.user.email) {
        return res.status(403).json(
            new ApiError(403, "Not authorized to cancel this booking")
        )
    }

    if (booking.status === "cancelled") {
        return res.status(400).json(
            new ApiError(400, "Booking is already cancelled")
        )
    }

    booking.status = "cancelled"
    await booking.save()

    await Bike.findByIdAndUpdate(booking.bikeId, { available: true })

    return res.status(200).json(
        new ApiResponse(200, booking, "Booking cancelled successfully")
    )
})

const confirmBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
        return res.status(404).json(
            new ApiError(404, "Booking not found")
        )
    }

    if (booking.status !== "pending") {
        return res.status(400).json(
            new ApiError(400, "Only pending bookings can be confirmed")
        )
    }

    booking.status = "confirmed"
    await booking.save()

    return res.status(200).json(
        new ApiResponse(200, booking, "Booking confirmed successfully")
    )
})

const completeBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
        return res.status(404).json(
            new ApiError(404, "Booking not found")
        )
    }

    if (booking.status !== "confirmed") {
        return res.status(400).json(
            new ApiError(400, "Only confirmed bookings can be completed")
        )
    }

    booking.status = "completed"
    await booking.save()

    await Bike.findByIdAndUpdate(booking.bikeId, { available: true })

    return res.status(200).json(
        new ApiResponse(200, booking, "Booking completed successfully")
    )
})

export { createBooking, getMyBookings, getAllBookings, cancelBooking, confirmBooking, completeBooking }
