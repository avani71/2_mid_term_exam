// Task 7: Try creating the same key pattern with a different custom name.
// MongoDB normally rejects a duplicate key pattern with conflicting options.

use("movieDB");

try {
  db.movies.createIndex(
    { genre: 1, rating: -1 },
    { name: "custom_genre_rating" }
  );
  print("Index creation succeeded on this MongoDB version/configuration.");
} catch (error) {
  print("Expected index creation error:");
  print(error.message);
}

print("All indexes:");
printjson(db.movies.getIndexes());
