import express from "express";
import {addProduct, getAllProducts, updateProduct} from "../controllers/productController.js"
import {requireSeller} from "../middleware/roleCheck.js"

const router = express.Router();


router.get("/", getAllProducts);
router.post("/",requireSeller, addProduct);
router.put("/:id",requireSeller, updateProduct);



export default router;