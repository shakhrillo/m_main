const {auth, firestore} = require('../services/firebaseAdmin');

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
    res.status(401).json({ message: 'Unauthorized' });
  }
}

const getUser = async (uid) => {
  const userRef = firestore.collection(`users`);

  return userRef.doc(uid).get();
}

const updateUser = async (uid, data) => {
  const reviewsRef = firestore.collection(`users`);

  return reviewsRef.doc(uid).update(data);
}

const createUserUsage = async (uid, data) => {
  const reviewsRef = firestore.collection(`users/${uid}/usage`);

  return reviewsRef.add(data);
}

module.exports = {
  verifyIdToken,
  getUser,
  updateUser,
  createUserUsage
}