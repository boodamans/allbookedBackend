const express = require('express');
const router = express.Router();
const ReviewLike = require('../models/reviewLike');
const { BadRequestError } = require('../expressError');
const { ensureCorrectUserOrAdmin } = require('../middleware/auth');

// Create a like for a review
router.post('/', async (req, res, next) => {
  try {
    const { username, reviewId } = req.body;

    if (!username || !reviewId) {
      throw new BadRequestError('Username and reviewId are required');
    }

    const likeId = await ReviewLike.reviewLike(username, reviewId);
    return res.status(201).json({ likeId });
  } catch (err) {
    return next(err);
  }
});

// Unlike a review
router.delete('/', async (req, res, next) => {
  try {
    const { username, reviewId } = req.body;

    if (!username || !reviewId) {
      throw new BadRequestError('Username and reviewId are required');
    }

    await ReviewLike.reviewUnlike(username, reviewId);
    return res.json({ message: 'Review unlike successful' });
  } catch (err) {
    return next(err);
  }
});

// Get like count for a review
router.get('/count/:reviewId', async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const likeCount = await ReviewLike.getLikes(reviewId);
    return res.json({ likeCount });
  } catch (err) {
    return next(err);
  }
});

router.get('/user/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new BadRequestError('Username is required');
    }

    const likedReviews = await ReviewLike.getLikedReviews(username);
    return res.json({ likes: likedReviews });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;