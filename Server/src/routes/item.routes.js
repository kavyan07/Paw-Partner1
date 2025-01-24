import { Router } from "express";
import {
    addItem,
    updateItem,
    getItem,
    deleteItem,
    getAllItems
} from "../controllers/item.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllItems);
router.route("/add").post(verifyJWT, checkRole(['shop owner']), upload.single("image"), addItem);
router.route("/update/:_id").patch(verifyJWT, checkRole(['shop owner']), updateItem);
router.route("/:_id").get(getItem);
router.route("/delete/:_id").delete(verifyJWT, checkRole(['shop owner']), deleteItem);

export default router;