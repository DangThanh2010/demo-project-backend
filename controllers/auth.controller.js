const userService = require ('../services/user.service');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');

module.exports.register = async (req, res) => {
  const result = await userService.createUser(req.body);
  res.send(result);
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  if(result.success){
    const tokens = await tokenService.generateAuthTokens(result.user);
    res.send({success: true, user: result.user, tokens });
  } else {
    res.send({success: false});
  }
}

module.exports.logout = async (req, res) => {
  const {refreshToken} = req.body
  await authService.logout(refreshToken);
  res.send({success: true});
};

module.exports.forgotPassword = async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  const {transporter, mailOptions} =  await authService.sendForgotPasswordEmail(req.body.email, resetPasswordToken);
  transporter.sendMail(mailOptions, function (err, info){
    if(err){
      res.send({success: false});
    }else{
      res.send({success: true});
    }
  })
};

module.exports.resetPassword = async (req, res) => {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  res.send({success: result});
};

module.exports.refreshTokens = async (req, res) => {
  const tokens = await authService.refreshTokens(req.body.refreshToken);

  if(tokens){
    res.send({ success: true, tokens });
  } else {
    res.send({ success:false });
  }
 
};