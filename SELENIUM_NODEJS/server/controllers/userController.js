// controllers/userController.js

const { firestore, auth } = require('../../firebase/main');

// Example function to get a user by ID from Firestore
exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const userDoc = await firestore.collection('customers').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userDoc.data());
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Example function to create a new user in Firebase Auth and Firestore
exports.createUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Add user details to Firestore
    await firestore.collection('users').doc(userRecord.uid).set({
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Failed to create user' });
  }
};
