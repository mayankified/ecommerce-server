// sendResetEmail.js

const nodemailer = require('nodemailer');
require('dotenv').config();




async function sendResetEmail(email, resetToken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hanushajain04@gmail.com',
            pass: "iooc pkvc ooar pyxr",
        },
    });
    const link=`${process.env.CLIENT_URL}/changepassword?token=${resetToken}`
    console.log(link)
// console.log(process.env.EMAIL_USER);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${link}`,
        html:`
        <div style="font-family: Helvetica, Arial, sans-serif; min-width:1000px; overflow:auto; line-height:2">
          <div style="margin:50px auto; width:70%; padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em; color: #00466a; text-decoration:none; font-weight:600">Ecommerce Project</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing our Brand. Use the following link to reset your password</p>
            <a href="${link}" style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">Click here</a>
            <p style="font-size:0.9em;">Regards,<br />Ecommerce</p>
            <hr style="border:none; border-top:1px solid #eee" />
          </div>
        </div>
      `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}

async function sendverifyEmail(email, otptoken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hanushajain04@gmail.com',
            pass: "iooc pkvc ooar pyxr",
        },
    });
// console.log(process.env.EMAIL_USER);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'User Registration',
        text: `Your otp is : ${otptoken}`,
        html:`
        <div style="font-family: Helvetica, Arial, sans-serif; min-width:1000px; overflow:auto; line-height:2">
          <div style="margin:50px auto; width:70%; padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em; color: #00466a; text-decoration:none; font-weight:600">Ecommerce Project</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing our Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
            <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otptoken}</h2>
            <p style="font-size:0.9em;">Regards,<br />Ecommerce</p>
            <hr style="border:none; border-top:1px solid #eee" />
          </div>
        </div>
      `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}

module.exports = {sendResetEmail,sendverifyEmail};

