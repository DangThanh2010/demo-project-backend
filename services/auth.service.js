const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const userService = require('./user.service');
const tokenService = require('./token.service');
const tokenModel = require('../models/token.model');
const tokenTypes = require('../configs/tokenTypes');

module.exports.login = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(bcrypt.compareSync(password, user.password))) {
    return {success: false};
  } else {
    return {success: true, user};
  }
};

module.exports.logout = async (refreshToken) => {
  const refreshTokenDoc = await tokenModel.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (refreshTokenDoc) {
    await refreshTokenDoc.remove();
  }
};

module.exports.sendForgotPasswordEmail = async (email, resetPasswordToken) => {
  {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Reset password token',
      text: `This is your reset password token
        \n Token: ${resetPasswordToken}
        `,
    };

    return { transporter, mailOptions };
  }
};

module.exports.resetPassword = async (resetPasswordToken, newPassword) => {
  const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
  if(!resetPasswordTokenDoc){
    return false;
  }
  const user = await userService.getUserById(resetPasswordTokenDoc.user);
  if (!user) {
    return false;
  }
  await userService.updatePasswordUserById(user.id, newPassword);
  await tokenModel.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  return true;
};

module.exports.refreshTokens = async (refreshToken) => {
  const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);

  if(!refreshTokenDoc){
    return false;
  }
  const user = await userService.getUserById(refreshTokenDoc.user);
  if (!user) {
    return false;
  }
  await refreshTokenDoc.remove();
  return tokenService.generateAuthTokens(user);
  
};

