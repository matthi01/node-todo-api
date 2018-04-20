const {User} = require('../models/user');

//middleware function to authenticate for all other routes
const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
  
    User.findByToken(token).then((user) => {
      if (!user) {
        res.status(401).send();
      }
  
      req.user = user;
      req.token = token;
      next();
    }).catch((err) => {
      // 401 - auth required
      res.status(401).send();
    });
};

module.exports = {authenticate};