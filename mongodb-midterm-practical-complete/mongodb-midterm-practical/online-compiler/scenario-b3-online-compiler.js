// MongoDB Midterm Practical - Scenario B3
// Paste this complete script into a MongoDB online editor that supports
// MongoDB 6.x shell commands (for example, myCompiler's MongoDB editor).
// This is a real MongoDB-style script, not Java or C.

db.movies.drop();

db.movies.insertMany([
  { _id: 1, title: "Silent River", genre: "Drama", rating: 8.4, year: 2019, cast: ["Asha", "Ravi"] },
  { _id: 2, title: "Rapid Chase", genre: "Action", rating: 7.2, year: 2020, cast: ["Vikram", "Asha"] },
  { _id: 3, title: "Lost Letters", genre: "Drama", rating: 7.1, year: 2018, cast: ["Meera", "Ravi"] },
  { _id: 4, title: "Iron Gate", genre: "Action", rating: 8.1, year: 2021, cast: ["Vikram", "Karan"] },
  { _id: 5, title: "Morning Song", genre: "Drama", rating: 8.8, year: 2022, cast: ["Meera", "Asha"] },
  { _id: 6, title: "Laugh Lane", genre: "Comedy", rating: 6.9, year: 2017, cast: ["Karan", "Meera"] },
  { _id: 7, title: "Night Heist", genre: "Action", rating: 6.5, year: 2019, cast: ["Vikram", "Ravi"] },
  { _id: 8, title: "Paper Boats", genre: "Drama", rating: 7.9, year: 2021, cast: ["Asha", "Karan"] }
]);

print("\\nTASK 1: EXPLAIN WITHOUT INDEX");
db.movies.dropIndexes();
var query = { genre: "Drama", rating: { $gte: 8 } };
printjson(db.movies.find(query).toArray());
var noIndex = db.movies.find(query).explain("executionStats");
printjson(noIndex.executionStats);
print("Winning plan:");
printjson(noIndex.queryPlanner.winningPlan);

print("\\nTASK 2: CREATE COMPOUND INDEX IN GOOD ORDER");
db.movies.createIndex(
  { genre: 1, rating: -1 },
  { name: "genre_1_rating_-1" }
);
var good = db.movies.find(query)
  .hint("genre_1_rating_-1")
  .explain("executionStats");
print("Good index execution statistics:");
printjson(good.executionStats);
print("Good index winning plan:");
printjson(good.queryPlanner.winningPlan);

print("\\nTASK 3: COMPARE WITH REVERSED/POOR INDEX");
db.movies.createIndex(
  { rating: -1, genre: 1 },
  { name: "rating_-1_genre_1" }
);
var poor = db.movies.find(query)
  .hint("rating_-1_genre_1")
  .explain("executionStats");
print("Poor index execution statistics:");
printjson(poor.executionStats);
print("Compare totalKeysExamined for the good and poor indexes.");

print("\\nTASK 4: DROP THE POOR INDEX");
db.movies.dropIndex("rating_-1_genre_1");
printjson(db.movies.getIndexes());

print("\\nTASK 5: MULTIKEY INDEX ON CAST");
db.movies.createIndex({ cast: 1 }, { name: "cast_1" });
var castExplain = db.movies.find({ cast: "Asha" })
  .hint("cast_1")
  .explain("executionStats");
print("Asha movies:");
printjson(db.movies.find({ cast: "Asha" }).hint("cast_1").toArray());
print("Multikey index explain:");
printjson(castExplain.queryPlanner.winningPlan);
print("nReturned: " + castExplain.executionStats.nReturned);

print("\\nTASK 6: HIDE AND UNHIDE THE COMPOUND INDEX");
db.movies.hideIndex("genre_1_rating_-1");
var hidden = db.movies.find(query).explain("executionStats");
print("Plan while compound index is hidden:");
printjson(hidden.queryPlanner.winningPlan);
db.movies.unhideIndex("genre_1_rating_-1");
var unhidden = db.movies.find(query).explain("executionStats");
print("Plan after compound index is unhidden:");
printjson(unhidden.queryPlanner.winningPlan);

print("\\nTASK 7: TRY SAME KEY PATTERN WITH A CUSTOM NAME");
try {
  db.movies.createIndex(
    { genre: 1, rating: -1 },
    { name: "custom_genre_rating" }
  );
  print("Index creation completed; inspect indexes below.");
} catch (error) {
  print("Index creation error: " + error.message);
}
print("All indexes at the end:");
printjson(db.movies.getIndexes());

print("\\nEXPECTED BASIC RESULTS:");
print("Drama movies rated 8 or above: Silent River, Morning Song");
print("Movies featuring Asha: Silent River, Rapid Chase, Morning Song, Paper Boats");
