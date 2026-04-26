import { Router } from "express"
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js"
import { createBooking, getMyBookings, getAllBookings, cancelBooking, confirmBooking, completeBooking } from "../controllers/booking.controller.js"

const router = Router()

router.route("/create").post(createBooking)
router.route("/my").get(verifyJWT, getMyBookings)
router.route("/all").get(verifyJWT, verifyAdmin, getAllBookings)
router.route("/:id/cancel").patch(verifyJWT, cancelBooking)
router.route("/:id/confirm").patch(verifyJWT, verifyAdmin, confirmBooking)
router.route("/:id/complete").patch(verifyJWT, verifyAdmin, completeBooking)

export default router
