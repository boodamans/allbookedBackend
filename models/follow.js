const db = require('../db');
const { BadRequestError } = require('../expressError');

class Follow {
  /**
   * Create a follow relationship.
   * @param {string} followerUsername - The username of the follower.
   * @param {string} followeeUsername - The username of the followee.
   */
  static async followUser(followerUsername, followeeUsername) {
    const result = await db.query(
      `INSERT INTO followers (follower_user_id, followee_user_id) VALUES ($1, $2) RETURNING follower_id`,
      [followerUsername, followeeUsername]
    );

    return result.rows[0].follower_id;
  }

  /**
   * Unfollow a user.
   * @param {string} followerUsername - The username of the follower.
   * @param {string} followeeUsername - The username of the followee.
   */
  static async unfollowUser(followerUsername, followeeUsername) {
    const result = await db.query(
      `DELETE FROM followers WHERE follower_user_id = $1 AND followee_user_id = $2 RETURNING follower_id`,
      [followerUsername, followeeUsername]
    );

    if (!result.rows.length) {
      throw new BadRequestError('Invalid unfollow request');
    }
  }
}

module.exports = Follow;
