import {Router} from "express"

const router = Router()

router.route("/")
.get((req,res)=>{
    res.render('landing')
})

export default router