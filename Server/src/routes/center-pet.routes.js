import { Router } from "express";
import {
    addAdoptionCenterPet,
    updateAdoptionCenterPet,
    getAdoptionCenterPets,
    deleteAdoptionCenterPet
} from "../controllers/center-pet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT,upload.single("image"), addAdoptionCenterPet);
router.route("/update/:_id").patch(verifyJWT, updateAdoptionCenterPet);
router.route("/").get(verifyJWT, getAdoptionCenterPets);
router.route("/delete/:_id").delete(verifyJWT, deleteAdoptionCenterPet);

export default router;