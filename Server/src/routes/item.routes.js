import { Router } from "express";
import {
    addItem,
    updateItem,
    getItem,
    deleteItem,
    getAllItems
} from "../controllers/item.controller.js";
import { verifyJWT, checkRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllItems);
router.route("/add").post(verifyJWT, checkRole(['petShop']), upload.single("image"), addItem);
router.route("/update/:_id").patch(verifyJWT, checkRole(['petShop']), updateItem);
router.route("/:_id").get(getItem);
router.route("/delete/:_id").delete(verifyJWT, checkRole(['petShop']), deleteItem);

export default router;