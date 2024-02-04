const express=require('express');
const { register, login, logout ,forgotPassword,getUserdetails,updatepassword, resetpassword, verify} = require('../Controllers/usercontroller');
const router=express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
require('dotenv').config();




router.post("/register",register);
router.post("/login",login);
router.post("/password/forgot",forgotPassword);
router.post("/logout",logout);
router.post("/me",getUserdetails,);
router.post("/changepassword",updatepassword)
router.post("/resetpassword",resetpassword)
router.post("/verify",verify)


module.exports=router;

