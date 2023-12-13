const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Review {
  /** Create a new review.
   *
   * Returns the newly created review.
   *
   * Data should be { username, google_books_api_id, rating, review_text }
   * where `username` is the username of the user creating the review.
   **/
  static async create({ username, google_books_api_id, rating, review_text }) {
    // Ensure the rating is between 1 and 10
    rating = Math.min(Math.max(rating, 1), 10);

    const result = await db.query(
      `INSERT INTO reviews
         (user_id, google_books_api_id, rating, review_text)
         VALUES (
           (SELECT username FROM users WHERE username = $1),
           $2, $3, $4)
         RETURNING review_id, user_id, google_books_api_id, rating, review_text, created_at`,
      [username, google_books_api_id, rating, review_text]
    );
    return result.rows[0];
  }

  /** Get details about a specific review.
   *
   * Returns { review_id, user_id, google_books_api_id, rating, review_text, created_at }
   * where `review_id` is the ID of the review and `user_id` is the ID of the user who created the review.
   *
   * Throws NotFoundError if the review is not found.
   **/
  static async get(reviewId) {
    const result = await db.query(
      `SELECT review_id, user_id, google_books_api_id, rating, review_text, created_at
         FROM reviews
         WHERE review_id = $1`,
      [reviewId]
    );

    const review = result.rows[0];

    if (!review) throw new NotFoundError(`Review not found with id: ${reviewId}`);

    return review;
  }

  /** Get all reviews for a specific book.
   *
   * Returns an array of review objects:
   * [{ review_id, user_id, google_books_api_id, rating, review_text, created_at }, ...]
   **/
  static async getByBook(googleBooksApiId) {
    const result = await db.query(
      `SELECT review_id, user_id, google_books_api_id, rating, review_text, created_at
         FROM reviews
         WHERE google_books_api_id = $1`,
      [googleBooksApiId]
    );

    return result.rows;
  }

  static async getReviewsByUser(username) {
    const result = await db.query(
      `SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC`,
      [username]
    );
  
    return result.rows;
  }

  /** Update a specific review.
   *
   * Data can include:
   *   { rating, review_text }
   *
   * Returns the updated review.
   *
   * Throws NotFoundError if the review is not found.
   **/
  static async update(reviewId, data) {
    const { rating, review_text } = data;

    // Ensure the rating is between 1 and 10
    const updatedRating = rating ? Math.min(Math.max(rating, 1), 10) : undefined;

    // Use the sqlForPartialUpdate helper to generate SET clause and values
    const { setCols, values } = sqlForPartialUpdate({ rating: updatedRating, review_text }, {
      rating: "rating",
      review_text: "review_text",
    });

    const result = await db.query(
      `UPDATE reviews
         SET ${setCols}
         WHERE review_id = $${values.length + 1}
         RETURNING review_id, user_id, google_books_api_id, rating, review_text, created_at`,
      [...values, reviewId]
    );

    const updatedReview = result.rows[0];

    if (!updatedReview) {
      throw new NotFoundError(`Review not found with id: ${reviewId}`);
    }

    return updatedReview;
  }

  /** Delete a specific review.
   *
   * Returns undefined.
   *
   * Throws NotFoundError if the review is not found.
   **/
  static async delete(reviewId) {
    const result = await db.query(
      `DELETE FROM reviews
         WHERE review_id = $1
         RETURNING review_id`,
      [reviewId]
    );

    const review = result.rows[0];

    if (!review) throw new NotFoundError(`Review not found with id: ${reviewId}`);
  }
}

module.exports = Review;
