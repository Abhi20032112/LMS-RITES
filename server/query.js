const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.db');

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      role TEXT NOT NULL,
      clBalance INTEGER DEFAULT 12,
      coBalance INTEGER DEFAULT 0,
      securityQuestion TEXT,
      securityAnswer TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created or already exists.');
      insertDefaultAdmin();
    }
  });
}

function insertDefaultAdmin() {
  const defaultAdmin = {
    username: '121212',
    password: 'admin@123',
    name: 'Admin',
    designation: 'Administrator',
    role: 'Admin',
    clBalance: 12,
    coBalance: 0,
    securityQuestion: "What is your mother's maiden name?",
    securityAnswer: 'Smith'
  };

  db.get('SELECT * FROM admins WHERE username = ?', [defaultAdmin.username], (err, row) => {
    if (err) {
      console.error('Error checking admin:', err.message);
    } else if (!row) {
      bcrypt.hash(defaultAdmin.password, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err.message);
        } else {
          db.run(`
            INSERT INTO admins (username, password_hash, name, designation, role, clBalance, coBalance, securityQuestion, securityAnswer)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [defaultAdmin.username, hash, defaultAdmin.name, defaultAdmin.designation, defaultAdmin.role, defaultAdmin.clBalance, defaultAdmin.coBalance, defaultAdmin.securityQuestion, defaultAdmin.securityAnswer], (err) => {
            if (err) {
              console.error('Error inserting default admin:', err.message);
            } else {
              console.log('Default admin inserted.');
              queryData();
            }
          });
        }
      });
    } else {
      console.log('Default admin already exists.');
      queryData();
    }
  });
}

function queryData() {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error getting tables:', err);
    } else {
      console.log('Tables:', tables.map(t => t.name));
    }
  });

  db.all("SELECT * FROM admins", (err, rows) => {
    if (err) {
      console.error('Error getting admins:', err);
    } else {
      console.log('Admins:', rows);
    }
    db.close();
  });
}

createTables();
