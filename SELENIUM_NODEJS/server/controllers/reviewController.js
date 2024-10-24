const { firestore } = require('../../firebase/main');

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
  let { url, uid } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    // const token = req.headers.authorization
    // console.log('Token:', token);
    console.log('UID:', uid);

    const generatedPort = Math.floor(Math.random() * 10000) + 10000;
    const subPort = generatedPort + 1;
    const imageName = `selenium/standalone-firefox:4.25.0-20241010`;
    const containerName = `selenium-${Date.now()}`;
    url = decodeURIComponent(url);

    await firestore.collection(
      `users/${uid}/reviews`
    ).add({
      url,
      container: {
        name: containerName,
        port: generatedPort,
        subPort,
        image: imageName,
      },
      serverTimestamp: new Date(),
      createdAt: new Date(),
      status: 'STARTED',
    });

    res.status(201).json({ message: 'Review created successfully' });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}