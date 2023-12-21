const db = require('../db');
const { BadRequestError } = require('../expressError');

class ReviewLike {
  /**
   * Create a like for a review.
   * @param {string} username - The username of the user who liked the review.
   * @param {number} reviewId - The ID of the review being liked.
   */
  static async reviewLike(username, reviewId) {
    const result = await db.query(
      `INSERT INTO review_likes (user_id, review_id) VALUES ($1, $2) RETURNING like_id`,
      [username, reviewId]
    );

    return result.rows[0].like_id;
  }

  /**
   * Unlike a review.
   * @param {string} username - The username of the user who liked the review.
   * @param {number} reviewId - The ID of the review being unliked.
   */
  static async reviewUnlike(username, reviewId) {
    const result = await db.query(
      `DELETE FROM review_likes WHERE user_id = $1 AND review_id = $2 RETURNING like_id`,
      [username, reviewId]
    );

    if (!result.rows.length) {
      throw new BadRequestError('Invalid unlike request');
    }
  }

 /**
   * Get the number of likes for a review.
   * @param {number} reviewId - The ID of the review.
   * @returns {number} - The count of likes for the review.
   */
  static async getLikes(reviewId) {
    const result = await db.query(
      `SELECT COUNT(*) AS like_count FROM review_likes WHERE review_id = $1`,
      [reviewId]
    );

    return result.rows[0].like_count;
  }

// gets likes by specific user, currently unused
  static async getLikedReviews(username) {
    const result = await db.query(
      `SELECT review_id
         FROM review_likes
         WHERE user_id = $1`,
      [username]
    );
  
    return result.rows.map(row => row.review_id);
  }
}

module.exports = ReviewLike;
