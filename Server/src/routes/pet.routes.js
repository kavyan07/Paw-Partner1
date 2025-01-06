import { addPet, updatePet, getPets, deletePet } from "../controllers/pet.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT,upload.single('petImage'),addPet)
router.route("/update").patch(verifyJWT,updatePet)
router.route("/").get(verifyJWT,getPets)
router.route("/delete/:_id").delete(verifyJWT,deletePet)

export default router