// middlewares/auth.js

const auth = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // For a real app, you would verify the token here
  // For example: jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {...});

  console.log('Authenticated successfully');
  next(); // Proceed to the next middleware or route handler
};

module.exports = auth;
