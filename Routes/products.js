const express = require("express");

const multer = require('multer');
const productController = require('../Controllers/productControllers.js');
const router = express.Router();
require("dotenv").config();



router.post("/get", productController.getProducts);

router.post("/:id", productController.getProductById);

router.post("/",  productController.createProduct);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

router.get("/get/count", productController.getProductCount);

router.get("/get/featured/:count", productController.getFeaturedProducts);


module.exports = router;
