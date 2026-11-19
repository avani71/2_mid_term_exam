// Task 5: Create a multikey index on the cast array and find movies
// in which Asha acted.

use("movieDB");

db.movies.createIndex({ cast: 1 }, { name: "cast_1" });

const result = db.movies.find({ cast: "Asha" })
  .hint("cast_1")
  .explain("executionStats");

function findIxscan(node) {
  if (!node || typeof node !== "object") return null;
  if (node.stage === "IXSCAN") return node;
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findIxscan(item);
        if (found) return found;
      }
    } else if (value && typeof value === "object") {
      const found = findIxscan(value);
      if (found) return found;
    }
  }
  return null;
}

const ixscan = findIxscan(result.queryPlanner.winningPlan);
print("Index name: cast_1");
print("isMultiKey: " + (ixscan ? ixscan.isMultiKey : "IXSCAN not found"));

print("Movies featuring Asha:");
printjson(
  db.movies.find({ cast: "Asha" }, { _id: 1, title: 1, cast: 1 })
    .hint("cast_1")
    .toArray()
);

print("nReturned: " + result.executionStats.nReturned);
