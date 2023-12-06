const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const { validate } = require('jsonschema');
const reviewNewSchema = require('../schemas/reviewNew.json');
const reviewUpdateSchema = require('../schemas/reviewUpdate.json');
const { BadRequestError, NotFoundError } = require('../expressError');

// Create a new review
router.post('/', async (req, res, next) => {
  try {
    // Validate the request body against the reviewNew schema
    const validationResult = validate(req.body, reviewNewSchema);
    if (!validationResult.valid) {
      throw new BadRequestError(validationResult.errors.map(e => e.stack).join('\n'));
    }

    const review = await Review.create(req.body);
    return res.status(201).json({ review });
  } catch (err) {
    return next(err);
  }
});

// Get a specific review
router.get('/:reviewId', async (req, res, next) => {
  try {
    const review = await Review.get(req.params.reviewId);
    return res.json({ review });
  } catch (err) {
    return next(err);
  }
});

// Update a review
router.patch('/:reviewId', async (req, res, next) => {
  try {
    // Validate the request body against the reviewUpdate schema
    const validationResult = validate(req.body, reviewUpdateSchema);
    if (!validationResult.valid) {
      throw new BadRequestError(validationResult.errors.map(e => e.stack).join('\n'));
    }

    const review = await Review.update(req.params.reviewId, req.body);
    return res.json({ review });
  } catch (err) {
    return next(err);
  }
});

// Delete a review
router.delete('/:reviewId', async (req, res, next) => {
  try {
    await Review.delete(req.params.reviewId);
    return res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    return next(err);
  }
});

// Other routes can be added as needed

module.exports = router;
