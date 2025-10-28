const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.run("DELETE FROM admins WHERE username != '121212'", (err) => {
  if (err) {
    console.error('Error deleting employees:', err);
  } else {
    console.log('All employees except dummy admin removed.');
  }
  db.close();
});
