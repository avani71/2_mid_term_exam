// Task 4: Drop the poorly ordered index.

use("movieDB");

db.movies.dropIndex("rating_-1_genre_1");

print("Remaining indexes:");
printjson(db.movies.getIndexes());
