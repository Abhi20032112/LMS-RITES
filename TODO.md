# TODO: Create Default IDs for SBU Head, HR, and Site Incharge

## Steps to Complete

1. **Edit server/server.js**
   - Add `insertDefaultUsers()` function to insert default users for SBU Head, HR, and Site Incharge into localStorage if they don't exist.
   - Call `insertDefaultUsers()` after `createTables()` in the database setup.
   - [x] Completed: Added insertDefaultUsers() function and called it in createTables().

2. **Restart the Server**
   - After editing, restart the server to apply changes and insert default users.
   - [x] Completed: Server restarted and default users inserted successfully.

3. **Test Login**
   - Test logging in with the new default IDs:
     - SBU Head: empId 'SBU001', password 'sbu@123'
     - HR: empId 'HR001', password 'hr@123'
     - Site Incharge: empId 'SITE001', password 'site@123'

## Default User Details
- **SBU Head**: empId: 'SBU001', name: 'John Doe', designation: 'SBU Head', role: 'SBU Head', password: 'sbu@123', clBalance: 12, coBalance: 0, securityQuestion: "What is your mother's maiden name?", securityAnswer: 'Smith', department: 'Management', dateOfJoining: '2023-01-01', contactInfo: 'john@example.com'
- **HR**: empId: 'HR001', name: 'Jane Smith', designation: 'HR Manager', role: 'HR', password: 'hr@123', clBalance: 12, coBalance: 0, securityQuestion: "What is your mother's maiden name?", securityAnswer: 'Smith', department: 'HR', dateOfJoining: '2023-01-01', contactInfo: 'jane@example.com'
- **Site Incharge**: empId: 'SITE001', name: 'Bob Johnson', designation: 'Site Incharge', role: 'Site Incharge', password: 'site@123', clBalance: 12, coBalance: 0, securityQuestion: "What is your mother's maiden name?", securityAnswer: 'Smith', department: 'Operations', dateOfJoining: '2023-01-01', contactInfo: 'bob@example.com'
