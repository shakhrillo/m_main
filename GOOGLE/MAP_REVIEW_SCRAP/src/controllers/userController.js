const {auth} = require('../services/firebaseAdmin');

const verifyIdToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    const user = await auth.verifyIdToken(token);

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    next();
  }
}

module.exports = {
  verifyIdToken
}