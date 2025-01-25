import { Router } from "express";
import {
    addAdoptionCenterPet,
    updateAdoptionCenterPet,
    getAdoptionCenterPets,
    deleteAdoptionCenterPet
} from "../controllers/center-pet.controller.js";
import { verifyJWT, checkRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT, checkRole(['adoptionCenter']), upload.single("image"), addAdoptionCenterPet);
router.route("/update/:_id").patch(verifyJWT, checkRole(['adoptionCenter']), updateAdoptionCenterPet);
router.route("/:_id").get(getAdoptionCenterPets);
router.route("/delete/:_id").delete(verifyJWT, checkRole(['adoptionCenter']), deleteAdoptionCenterPet);

export default router;