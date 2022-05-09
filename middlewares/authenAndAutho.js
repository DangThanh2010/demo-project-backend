const passport = require('passport');

const verifyCallback = (req, resolve, reject, role) => async (err, user, info) => {
 
  if(err || !user){
    return reject(new Error('Please authenticate'));
  } else {
    if(user.role !== role){
      return reject(new Error("You aren't permit for this feature"));
    } else {
      resolve();
    }
  }
};

const auth =
  (role) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, role))(req, res, next);
    })
      .then(() => next())
      .catch((err) => res.send({success: false}));
  };

module.exports = auth;

