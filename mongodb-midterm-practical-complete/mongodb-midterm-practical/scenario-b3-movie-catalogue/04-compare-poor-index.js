// Task 3: Create the reversed/poorly ordered compound index and force it.

use("movieDB");

db.movies.createIndex(
  { rating: -1, genre: 1 },
  { name: "rating_-1_genre_1" }
);

const query = { genre: "Drama", rating: { $gte: 8 } };

print("Good index forced:");
const good = db.movies.find(query)
  .hint("genre_1_rating_-1")
  .explain("executionStats");

print("Good index totalKeysExamined: " +
  good.executionStats.totalKeysExamined);
print("Good index totalDocsExamined: " +
  good.executionStats.totalDocsExamined);

print("Poor/reversed index forced:");
const poor = db.movies.find(query)
  .hint("rating_-1_genre_1")
  .explain("executionStats");

print("Poor index totalKeysExamined: " +
  poor.executionStats.totalKeysExamined);
print("Poor index totalDocsExamined: " +
  poor.executionStats.totalDocsExamined);

print("Compare the two examined-key counts; exact values can vary by MongoDB version.");
