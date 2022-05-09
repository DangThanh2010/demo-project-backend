const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');

module.exports.createUser = async (body) => {
  const { email, password, role } = body;

  const hashPassword = await bcrypt.hash(password, 8);

  const haveUser = await userModel.findOne({ where: {email: email}});
  if(haveUser){
    return {success: false};
  } 
  else {
    const user = await userModel.create({
      email: email,
      password: hashPassword,
      role: role
    });
    
    return {success: true, user};
  }
};

module.exports.getUserByEmail = async (email) => {
  return await userModel.findOne({ where: {email: email}});
}

module.exports.getUserById = async (id) => {
  return await userModel.findOne({ where: {id: id}});
}

module.exports.updatePasswordUserById = async (id, password) => {
  const hashPassword = await bcrypt.hash(password, 8);
  return await userModel.update({
    password: hashPassword,
  }, {
    where: {
      id: id
    }
  })
}

module.exports.getListUser = async () => {
  return await userModel.findAll({ where: {role: 1}});
}

module.exports.getListAdmin = async () => {
  return await userModel.findAll({ where: {role: 0}});
}
