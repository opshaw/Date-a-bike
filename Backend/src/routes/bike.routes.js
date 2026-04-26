import { Router } from "express"
import { getAllBikes, getBikeById, seedBikes } from "../controllers/bike.controller.js"

const router = Router()

router.route("/").get(getAllBikes)
router.route("/:id").get(getBikeById)
router.route("/seed").post(seedBikes)

export default router
