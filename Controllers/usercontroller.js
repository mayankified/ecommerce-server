const User = require("../models/usermodels");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const sendToken = require("../Utils/jwtToken");
// require('dotenv').config();
const { sendResetEmail, sendverifyEmail } = require("../Utils/sendEmail");
const ErrorHandler = require("../Utils/errorHandler");


// const authenticateUser=require("../utils/authentication");
// Function for registering the user

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userr = await User.findOne({ email });

    if (userr) {
      return res
        .status(401)
        .json({ success: false, message: "Email id Already in use" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: "User registered",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//register pe otp generate krke db me store krdenge and then verify api call krenge

exports.verify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP or user not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "OTP verification successful" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(password === user.password)) {
      console.log("Login failed. Invalid credentials.");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    sendToken(user, 200, res);
    // console.log("Hi");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  // Bascially not getting what actually it is doing
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

// exports.forgotPassword=async(req,res,next)=>{
//     const user=await User.findOne({email: req.body.email});
//     if(!user){
//         return next(new ErrorHandler("User is not found"),404);
//     }
//         const resetToken=user.getResetPasswordToken();
//         await user.save({validateBeforeSave: false});
//         const resetpasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
//         const message=`Your password reset  token is \n\n ${resetpasswordUrl} \n\n if you have not requested this then please ignore this email`;
//         try{
//             await sendEmail({
//                 email: user.email,
//                 subject: `mail is sent successfully`,
//                 message
//             });
//             res.status(200).json({
//                 success:true,
//                 message:`Email is send to ${user.email} successfully`
//             });
//         }
//             catch (error) {
//                 console.error('Error sending email:', error);
//                 user.resetpasswordToken = undefined;
//                 user.resetpasswordExpire = undefined;
//                 await user.save({ validateBeforeSave: false });

//                 return res.status(500).json({
//                     success: false,
//                     message: 'Failed to send the email for password reset'
//                 });
//             }
//         }

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User is not found"), 404);
  }

  const resetToken = await user.getResetPasswordToken(user.email);
  // console.log(resetToken)
  await user.save({ validateBeforeSave: false });

  try {
    await sendResetEmail(user.email, resetToken);
    res.status(200).json({
      success: true,
      message: `Email is sent to ${user.email} successfully`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: "Failed to send the email for password reset",
    });
  }
};

// Get user details
exports.getUserdetails = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(200).json({
      success: true,
      user,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "The following user doesn't exists",
    });
  }
};

exports.updatepassword = async (req, res) => {
  const { oldPassword, newPassword, id } = req.body;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    if (!user.password) {
      return res.status(500).json({
        success: false,
        message: "User password is missing or undefined",
      });
    }

    const isPasswordMatch = oldPassword === user.password;

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old password" });
    }

    // Update the hashed password with the new one
    user.password = newPassword;

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//RESET password ke liye api..email send krne ke baad new password set option ke liye hai ye

exports.resetpassword = async (req, res) => {
  const resettoken = req.query.token;

  const decoded = Jwt.verify(resettoken, process.env.RESET_KEY);
  //     // req.user = decoded;
  console.log(decoded);
  const { pass } = req.body;
  try {
    const user = await User.findOne({ email: decoded });
    console.log(user);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    user.password = pass;

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
