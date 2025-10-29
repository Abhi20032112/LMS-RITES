const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const ExcelManager = require('./excelManager');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Excel Manager
const excelManager = new ExcelManager();

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    createTables();
  }
});

// Create tables
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
      insertDefaultAdmins();
      insertDefaultUsers();
    }
  });
}

// Insert default admins
function insertDefaultAdmins() {
  const defaultAdmins = [
    {
      username: '99508',
      password: 'admin@123',
      name: 'Rupal Gautam',
      designation: 'Administrator',
      role: 'Admin',
      clBalance: 12,
      coBalance: 0,
      securityQuestion: "What is your mother's maiden name?",
      securityAnswer: 'Smith'
    },
    {
      username: '13566',
      password: 'admin@123',
      name: 'Veeravalli Sri Ram Kumar',
      designation: 'Administrator',
      role: 'Admin',
      clBalance: 12,
      coBalance: 0,
      securityQuestion: "What is your mother's maiden name?",
      securityAnswer: 'Smith'
    }
  ];

  defaultAdmins.forEach(admin => {
    db.get('SELECT * FROM admins WHERE username = ?', [admin.username], (err, row) => {
      if (err) {
        console.error('Error checking admin:', err.message);
      } else if (!row) {
        bcrypt.hash(admin.password, 10, (err, hash) => {
          if (err) {
            console.error('Error hashing password:', err.message);
          } else {
            db.run(`
              INSERT INTO admins (username, password_hash, name, designation, role, clBalance, coBalance, securityQuestion, securityAnswer)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [admin.username, hash, admin.name, admin.designation, admin.role, admin.clBalance, admin.coBalance, admin.securityQuestion, admin.securityAnswer], (err) => {
              if (err) {
                console.error('Error inserting default admin:', err.message);
              } else {
                console.log(`Default admin ${admin.name} inserted.`);
              }
            });
          }
        });
      }
    });
  });
}

// Insert default users for SBU Head, HR, and Site Incharge
function insertDefaultUsers() {
  const defaultUsers = [
    {
      empId: 'SBU001',
      name: 'John Doe',
      designation: 'SBU Head',
      role: 'SBU Head',
      password: 'sbu@123',
      clBalance: 12,
      coBalance: 0,
      securityQuestion: "What is your mother's maiden name?",
      securityAnswer: 'Smith',
      department: 'Management',
      dateOfJoining: '2023-01-01',
      contactInfo: 'john@example.com'
    },
    {
      empId: 'HR001',
      name: 'Jane Smith',
      designation: 'HR Manager',
      role: 'HR',
      password: 'hr@123',
      clBalance: 12,
      coBalance: 0,
      securityQuestion: "What is your mother's maiden name?",
      securityAnswer: 'Smith',
      department: 'HR',
      dateOfJoining: '2023-01-01',
      contactInfo: 'jane@example.com'
    },
    {
      empId: 'SITE001',
      name: 'Bob Johnson',
      designation: 'Site Incharge',
      role: 'Site Incharge',
      password: 'site@123',
      clBalance: 12,
      coBalance: 0,
      securityQuestion: "What is your mother's maiden name?",
      securityAnswer: 'Smith',
      department: 'Operations',
      dateOfJoining: '2023-01-01',
      contactInfo: 'bob@example.com'
    }
  ];

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  defaultUsers.forEach(user => {
    if (!users.find(u => u.empId === user.empId)) {
      users.push(user);
      console.log(`Default user ${user.name} (${user.role}) inserted.`);
    }
  });

  localStorage.setItem('users', JSON.stringify(users));
}

// API Routes
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Validate that only specific admin IDs are allowed
  if (username !== '99508' && username !== '13566') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
  }

  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (!row) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    bcrypt.compare(password, row.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error comparing password' });
      }
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Return user object
      const user = {
        empId: row.username,
        name: row.name,
        designation: row.designation,
        role: row.role,
        clBalance: row.clBalance,
        coBalance: row.coBalance,
        securityQuestion: row.securityQuestion,
        securityAnswer: row.securityAnswer
      };

      res.json({ success: true, user });
    });
  });
});

// API Routes for Leave Management
app.post('/api/leave/submit', (req, res) => {
  const { empId, name, designation, leaveType, from, to, days } = req.body;

  const leaveRequest = {
    leaveId: `LV${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    empId,
    name,
    designation,
    leaveType,
    from,
    to,
    days,
    siteIncharge: 'Pending',
    hr: 'Pending',
    sbuHead: 'Pending',
    finalStatus: 'Pending at Site Incharge',
    remarks: '',
    submittedDate: new Date().toISOString(),
  };

  // Store in localStorage (for now, will migrate to DB later)
  const allRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
  allRequests.push(leaveRequest);
  localStorage.setItem('leaveRequests', JSON.stringify(allRequests));

  // Update Excel file
  excelManager.addLeaveRecord(name, leaveRequest);

  res.json({ success: true, leaveRequest });
});

app.get('/api/leave/requests', (req, res) => {
  const requests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
  res.json({ success: true, requests });
});

app.post('/api/leave/approve', (req, res) => {
  const { leaveId, approverRole, status, remarks } = req.body;

  const allRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
  const requestIndex = allRequests.findIndex(r => r.leaveId === leaveId);

  if (requestIndex === -1) {
    return res.status(404).json({ success: false, message: 'Leave request not found' });
  }

  const request = allRequests[requestIndex];

  // Update approval status
  if (approverRole === 'siteincharge') {
    request.siteIncharge = status;
  } else if (approverRole === 'hr') {
    request.hr = status;
  } else if (approverRole === 'sbuhead') {
    request.sbuHead = status;
  }

  // Determine final status
  if (request.siteIncharge === 'Approved' && request.hr === 'Approved' && request.sbuHead === 'Approved') {
    request.finalStatus = 'Approved (Final)';
  } else if (request.siteIncharge === 'Rejected' || request.hr === 'Rejected' || request.sbuHead === 'Rejected') {
    request.finalStatus = 'Rejected';
  }

  request.remarks = remarks || '';

  // Save back to localStorage
  localStorage.setItem('leaveRequests', JSON.stringify(allRequests));

  // Update Excel file
  excelManager.updateLeaveStatus(request.name, request);

  res.json({ success: true, request });
});

app.post('/api/user/create', (req, res) => {
  const { empId, name, designation, role, password, clBalance, coBalance, securityQuestion, securityAnswer, department, dateOfJoining, contactInfo } = req.body;

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (users.find(u => u.empId === empId)) {
    return res.status(400).json({ success: false, message: 'Employee ID already exists' });
  }

  const newUser = {
    empId,
    name,
    designation,
    role,
    password,
    clBalance: clBalance || 12,
    coBalance: coBalance || 0,
    securityQuestion,
    securityAnswer,
    department: department || '',
    dateOfJoining: dateOfJoining || '',
    contactInfo: contactInfo || '',
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Create Excel sheet for new employee
  excelManager.createEmployeeSheet(empId, name);

  res.json({ success: true, user: newUser });
});

app.get('/api/users', (req, res) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  res.json({ success: true, users });
});

app.get('/api/download/excel', (req, res) => {
  const filePath = excelManager.getFilePath();
  res.download(filePath, 'LEAVE MANAGEMENT.xlsx');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
