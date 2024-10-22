// controllers/reviewController.js

const { firestore, auth } = require('../config/firebase');

exports.getReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default values for page and limit
  const offset = (page - 1) * limit; // Calculate the offset

  try {
    const reviewsCollection = await firestore.collection('reviews')
      .orderBy('createdAt') // Ensure you have a field to order by (like createdAt)
      .offset(offset) // Apply the offset
      .limit(Number(limit)) // Apply the limit
      .get();

    const reviews = [];

    reviewsCollection.forEach((doc) => {
      reviews.push(doc.data());
    });

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found' });
    }

    // Calculate the total number of reviews
    const totalReviewsSnapshot = await firestore.collection('reviews').get();
    console.log('totalReviewsSnapshot:', totalReviewsSnapshot);
    const totalReviews = totalReviewsSnapshot.size;

    res.json({
      page: Number(page),
      limit: Number(limit),
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
      reviews,
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required' });
  }

  try {
    // const token = req.headers.authorization?.split(' ')[1];
    // const { uid } = await auth.verifyIdToken(token);

    const review = {
      rating,
      comment,
      // userId: uid,
      createdAt: new Date(),
    };

    const newReview = await firestore.collection('reviews').add(review);

    res.status(201).json({ id: newReview.id, ...review });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}