const express = require('express');
const router = express.Router();
const Follow = require('../models/follow');
const { BadRequestError } = require('../expressError');
const { ensureCorrectUserOrAdmin } = require('../middleware/auth');

// Follow a user
router.post('/', async (req, res, next) => {
  try {
    const { followerUsername, followeeUsername } = req.body;

    if (!followerUsername || !followeeUsername) {
      throw new BadRequestError('Follower username and followee username are required');
    }

    const followerId = await Follow.followUser(followerUsername, followeeUsername);
    return res.status(201).json({ followerId });
  } catch (err) {
    return next(err);
  }
});

// Unfollow a user
router.delete('/', async (req, res, next) => {
  try {
    const { followerUsername, followeeUsername } = req.body;

    if (!followerUsername || !followeeUsername) {
      throw new BadRequestError('Follower username and followee username are required');
    }

    await Follow.unfollowUser(followerUsername, followeeUsername);
    return res.json({ message: 'Unfollow successful' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
