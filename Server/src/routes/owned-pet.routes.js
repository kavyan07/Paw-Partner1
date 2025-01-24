import {
    addOwnedPet,
    updateOwnedPet,
    getOwnedPets,
    deleteOwnedPet
 } from "../controllers/owned-pet.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT,upload.single('image'),addOwnedPet)
router.route("/update/:_id").patch(verifyJWT,updateOwnedPet)
router.route("/delete/:_id").delete(verifyJWT,deleteOwnedPet)
router.route("/").get(verifyJWT, getOwnedPets)

export default router