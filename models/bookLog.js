const db = require('../db');
const { BadRequestError } = require('../expressError');

// CURRENTLY NOT USED, FOR FUTURE FEATURES NOT YET IMPLEMENTED AS OF 12/21/2023

class BookLog {
  /**
   * Add a book to the user's read books.
   * @param {string} username - The username of the user.
   * @param {string} googleBooksApiId - The ID from the Google Books API for the book.
   */
  static async addToReadBooks(username, googleBooksApiId) {
    const result = await db.query(
      `UPDATE users SET read_books = array_append(read_books, $2) WHERE username = $1 RETURNING read_books`,
      [username, googleBooksApiId]
    );

    return result.rows[0].read_books;
  }

  /**
   * Remove a book from the user's read books.
   * @param {string} username - The username of the user.
   * @param {string} googleBooksApiId - The ID from the Google Books API for the book.
   */
  static async removeFromReadBooks(username, googleBooksApiId) {
    const result = await db.query(
      `UPDATE users SET read_books = array_remove(read_books, $2) WHERE username = $1 RETURNING read_books`,
      [username, googleBooksApiId]
    );

    return result.rows[0].read_books;
  }

  /**
   * Add a book to the user's ranked favorite books.
   * @param {string} username - The username of the user.
   * @param {string} googleBooksApiId - The ID from the Google Books API for the book.
   * @param {number} rank - The rank for the book (1 to 4).
   */
  static async addToFavoriteBooks(username, googleBooksApiId, rank) {
    const result = await db.query(
      `UPDATE users SET favorite_books_ranked[$2] = $3 WHERE username = $1 RETURNING favorite_books_ranked`,
      [username, rank, googleBooksApiId]
    );

    return result.rows[0].favorite_books_ranked;
  }

  /**
   * Remove a book from the user's ranked favorite books.
   * @param {string} username - The username of the user.
   * @param {number} rank - The rank for the book (1 to 4).
   */
  static async removeFromFavoriteBooks(username, rank) {
    const result = await db.query(
      `UPDATE users SET favorite_books_ranked[$2] = NULL WHERE username = $1 RETURNING favorite_books_ranked`,
      [username, rank]
    );

    return result.rows[0].favorite_books_ranked;
  }
}

module.exports = BookLog;
