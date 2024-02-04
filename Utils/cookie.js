const Jwt =require("jsonwebtoken");

const sendCookie = (user, res, message, statuscode = 200) => {
  const token = Jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res
    .status(statuscode)

    .cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 1000 * 60,
    })
    .json({
      success: true,
      message,
    });
};

module.exports=sendCookie