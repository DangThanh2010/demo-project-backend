const userService = require ('../services/user.service');

module.exports.getListUser = async (req, res) => {
  const result = await userService.getListUser();
  res.send({success: true, result});
};

module.exports.getListAdmin = async (req, res) => {
  const result = await userService.getListAdmin();
  res.send({success: true, result});
}
