-- Create users table
CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  read_books INTEGER[]
);

-- Create reviews table
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(username),
  google_books_api_id VARCHAR(255),
  rating INTEGER,
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create favorite_books table
CREATE TABLE favorite_books (
  favorite_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(username),
  google_books_api_id VARCHAR(255)
);

-- Create followers table
CREATE TABLE followers (
  follower_id SERIAL PRIMARY KEY,
  follower_user_id INTEGER REFERENCES users(username),
  followee_user_id INTEGER REFERENCES users(username)
);

-- Create review_likes table
CREATE TABLE review_likes (
  like_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(username),
  review_id INTEGER REFERENCES reviews(review_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
