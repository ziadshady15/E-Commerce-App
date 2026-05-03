//3lshan at2kd mn 
const jwt  = require('jsonwebtoken');//3lshan n3ml verify lel token
const User = require('../models/User');//3lshan ndwr fl database 

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;//read the header
// el frontend byb3t el header keda Authorization: Bearer eyJhbGci...
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token   = authHeader.split(' ')[1];//hsneel bearer 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');//hat kol haga mn el database m3ada el password

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {//kan fe error bsbb el eslint fa claude 2aly 23ml el config.js file dah
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = protect;