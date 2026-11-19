// Task 1: Explain the query without a suitable index.

use("movieDB");

const query = { genre: "Drama", rating: { $gte: 8 } };

// Drop all non-_id indexes so the query demonstrates a collection scan.
db.movies.dropIndexes();

print("Query results:");
printjson(db.movies.find(query).toArray());

print("Execution statistics without a suitable index:");
const result = db.movies.find(query).explain("executionStats");
print("winningPlan.stage: " + result.queryPlanner.winningPlan.stage);
print("nReturned: " + result.executionStats.nReturned);
print("totalDocsExamined: " + result.executionStats.totalDocsExamined);
print("totalKeysExamined: " + result.executionStats.totalKeysExamined);
printjson(result.queryPlanner.winningPlan);
