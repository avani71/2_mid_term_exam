// Task 2: Create the compound index in the efficient order.
// Equality field first (genre), then rating.

use("movieDB");

db.movies.createIndex(
  { genre: 1, rating: -1 },
  { name: "genre_1_rating_-1" }
);

const query = { genre: "Drama", rating: { $gte: 8 } };
const result = db.movies.find(query).explain("executionStats");

print("Created index: genre_1_rating_-1");
print("winningPlan:");
printjson(result.queryPlanner.winningPlan);
print("nReturned: " + result.executionStats.nReturned);
print("totalDocsExamined: " + result.executionStats.totalDocsExamined);
print("totalKeysExamined: " + result.executionStats.totalKeysExamined);
