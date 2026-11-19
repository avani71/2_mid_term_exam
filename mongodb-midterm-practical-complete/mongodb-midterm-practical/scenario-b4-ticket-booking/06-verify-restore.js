// Task 5: Verify that all five bookings have been restored.

use("ticketDB");

const count = db.bookings.countDocuments();
print("Restored booking count: " + count);
printjson(
  db.bookings.find(
    {},
    { _id: 1, passenger: 1, seats: 1, route: 1 }
  ).sort({ _id: 1 }).toArray()
);

if (count !== 5) {
  print("WARNING: Expected 5 documents, but found " + count);
} else {
  print("SUCCESS: All 5 booking documents are present.");
}
