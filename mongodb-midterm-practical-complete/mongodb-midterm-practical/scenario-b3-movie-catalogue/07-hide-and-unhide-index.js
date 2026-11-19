// Task 6: Hide the compound index, run the query, then unhide it.

use("movieDB");

const query = { genre: "Drama", rating: { $gte: 8 } };

db.movies.hideIndex("genre_1_rating_-1");

print("Index hidden. Query explain:");
const hiddenResult = db.movies.find(query).explain("executionStats");
printjson(hiddenResult.queryPlanner.winningPlan);
print("nReturned: " + hiddenResult.executionStats.nReturned);
print("totalDocsExamined: " +
  hiddenResult.executionStats.totalDocsExamined);

db.movies.unhideIndex("genre_1_rating_-1");

print("Index unhidden. Query explain:");
const visibleResult = db.movies.find(query).explain("executionStats");
printjson(visibleResult.queryPlanner.winningPlan);
print("nReturned: " + visibleResult.executionStats.nReturned);
print("totalKeysExamined: " +
  visibleResult.executionStats.totalKeysExamined);
