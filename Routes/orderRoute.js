const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/orderController.js");

router.get("/", orderController.getAllOrders);

router.get("/:id", orderController.getOrderById);

router.post("/", orderController.createOrder);

router.post("/payment", orderController.Stripepayment);

router.put("/:id", orderController.updateOrderById);

router.delete("/:id", orderController.deleteOrderById);

router.get("/get/count", orderController.getOrderCount);

router.get("/get/totalsales", orderController.getTotalSales);

router.get("/get/usersorders/:userid", orderController.getUsersOrders);

module.exports = router;
