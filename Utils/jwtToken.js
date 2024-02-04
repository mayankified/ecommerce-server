const Jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
  const token = Jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
   
    res
    .status(statusCode)

    .cookie("token", token, {
        maxAge: 15 * 1000 * 60,
        httpOnly: true,
        secure:true,
      
    })
    .json({
      success: true,
      user,
    });
};

module.exports = sendToken;
