const express = require('express');
const router = express.Router();
const BookLog = require('../models/bookLog');
const { BadRequestError } = require('../expressError');
const { ensureCorrectUserOrAdmin } = require('../middleware/auth');

// Add a book to the user's read books
router.post('/read', ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { googleBooksApiId, username } = req.body;
    const readBooks = await BookLog.addToReadBooks(username, googleBooksApiId);
    return res.json({ readBooks });
  } catch (err) {
    return next(err);
  }
});

// Remove a book from the user's read books
router.delete('/read', ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { googleBooksApiId, username } = req.body;
    const readBooks = await BookLog.removeFromReadBooks(username, googleBooksApiId);
    return res.json({ readBooks });
  } catch (err) {
    return next(err);
  }
});

// Add a book to the user's ranked favorite books
router.post('/favorite', ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { googleBooksApiId, username, rank } = req.body;
    const favoriteBooksRanked = await BookLog.addToFavoriteBooks(username, googleBooksApiId, rank);
    return res.json({ favoriteBooksRanked });
  } catch (err) {
    return next(err);
  }
});

// Remove a book from the user's ranked favorite books
router.delete('/favorite', ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { rank, username } = req.body;
    const favoriteBooksRanked = await BookLog.removeFromFavoriteBooks(username, rank);
    return res.json({ favoriteBooksRanked });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
