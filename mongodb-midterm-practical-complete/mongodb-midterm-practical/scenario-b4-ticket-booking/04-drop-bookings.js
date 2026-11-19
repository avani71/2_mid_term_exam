// Task 3: Simulate accidental deletion.
// WARNING: This drops the live collection from the replica set.

use("ticketDB");

print("Count before drop: " + db.bookings.countDocuments());
db.bookings.drop();
print("Collection dropped.");
print("Count after drop: " + db.bookings.countDocuments());
