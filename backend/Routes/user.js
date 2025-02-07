const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userControllers");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/sendOtp", UserController.sendOtp);
router.post("/verifyOtp", UserController.verifyOtp);
router.post("/logout", UserController.logout);
router.delete("/:email", UserController.deleteAccount);

module.exports = router;

