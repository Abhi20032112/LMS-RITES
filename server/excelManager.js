const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class ExcelManager {
  constructor(filePath = '../LEAVE MANAGEMENT .xlsx') {
    this.filePath = path.resolve(__dirname, filePath);
    this.workbook = null;
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(this.filePath)) {
      this.workbook = XLSX.utils.book_new();
      
      // Create Summary sheet
      const summaryWs = XLSX.utils.aoa_to_sheet([
        ['Employee ID', 'Employee Name', 'Total Leaves', 'Leaves Taken', 'Leaves Remaining']
      ]);
      XLSX.utils.book_append_sheet(this.workbook, summaryWs, 'Summary');
      
      XLSX.writeFile(this.workbook, this.filePath);
    } else {
      this.workbook = XLSX.readFile(this.filePath);
      
      // Ensure Summary sheet exists
      if (!this.workbook.SheetNames.includes('Summary')) {
        const summaryWs = XLSX.utils.aoa_to_sheet([
          ['Employee ID', 'Employee Name', 'Total Leaves', 'Leaves Taken', 'Leaves Remaining']
        ]);
        XLSX.utils.book_append_sheet(this.workbook, summaryWs, 'Summary');
        XLSX.writeFile(this.workbook, this.filePath);
      }
    }
  }

  createEmployeeSheet(employeeId, employeeName) {
    const sheetName = employeeName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 31); // Excel sheet name limit

    if (this.workbook.SheetNames.includes(sheetName)) {
      return; // Sheet already exists
    }

    // Create employee sheet
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Date', 'Leave Type', 'From', 'To', 'Days', 'Status', 'Remarks']
    ]);
    XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetName);

    // Update Summary sheet
    const summaryWs = this.workbook.Sheets['Summary'];
    const summaryData = XLSX.utils.sheet_to_json(summaryWs, { header: 1 });
    summaryData.push([
      employeeId,
      employeeName,
      20, // Default total leaves
      0,  // Leaves taken
      20  // Remaining leaves
    ]);
    this.workbook.Sheets['Summary'] = XLSX.utils.aoa_to_sheet(summaryData);

    XLSX.writeFile(this.workbook, this.filePath);
  }

  addLeaveRecord(employeeId, employeeName, leaveData) {
    const sheetName = employeeName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 31);

    if (!this.workbook.SheetNames.includes(sheetName)) {
      this.createEmployeeSheet(employeeId, employeeName);
    }

    // Add leave record to employee sheet
    const worksheet = this.workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const newRow = [
      new Date().toLocaleDateString(),
      leaveData.leaveType,
      new Date(leaveData.from).toLocaleDateString(),
      new Date(leaveData.to).toLocaleDateString(),
      leaveData.days,
      leaveData.finalStatus,
      leaveData.remarks || ''
    ];

    jsonData.push(newRow);
    this.workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(jsonData);

    // Update Summary sheet if leave is approved
    if (leaveData.finalStatus === 'Approved') {
      const summaryWs = this.workbook.Sheets['Summary'];
      const summaryData = XLSX.utils.sheet_to_json(summaryWs, { header: 1 });
      
      for (let i = 1; i < summaryData.length; i++) {
        if (summaryData[i][0] === employeeId) {
          const totalLeaves = summaryData[i][2];
          const leavesTaken = summaryData[i][3] + leaveData.days;
          summaryData[i][3] = leavesTaken;
          summaryData[i][4] = totalLeaves - leavesTaken;
          break;
        }
      }
      
      this.workbook.Sheets['Summary'] = XLSX.utils.aoa_to_sheet(summaryData);
    }

    XLSX.writeFile(this.workbook, this.filePath);
  }

  updateLeaveStatus(employeeId, employeeName, leaveData) {
    const sheetName = employeeName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 31);

    if (!this.workbook.SheetNames.includes(sheetName)) {
      return; // Sheet doesn't exist
    }

    const worksheet = this.workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let oldStatus = '';
    let updatedDays = 0;

    // Find and update the row with matching leave type and dates
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row[1] === leaveData.leaveType &&
          row[2] === new Date(leaveData.from).toLocaleDateString() &&
          row[3] === new Date(leaveData.to).toLocaleDateString()) {
        oldStatus = row[5];
        updatedDays = row[4];
        row[5] = leaveData.finalStatus;
        row[6] = leaveData.remarks || '';
        break;
      }
    }

    this.workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(jsonData);

    // Update Summary sheet based on status change
    if (oldStatus !== leaveData.finalStatus) {
      const summaryWs = this.workbook.Sheets['Summary'];
      const summaryData = XLSX.utils.sheet_to_json(summaryWs, { header: 1 });
      
      for (let i = 1; i < summaryData.length; i++) {
        if (summaryData[i][0] === employeeId) {
          const totalLeaves = summaryData[i][2];
          let leavesTaken = summaryData[i][3];
          
          if (oldStatus === 'Approved' && leaveData.finalStatus !== 'Approved') {
            leavesTaken -= updatedDays;
          } else if (oldStatus !== 'Approved' && leaveData.finalStatus === 'Approved') {
            leavesTaken += updatedDays;
          }
          
          summaryData[i][3] = leavesTaken;
          summaryData[i][4] = totalLeaves - leavesTaken;
          break;
        }
      }
      
      this.workbook.Sheets['Summary'] = XLSX.utils.aoa_to_sheet(summaryData);
    }

    XLSX.writeFile(this.workbook, this.filePath);
  }

  getFilePath() {
    return this.filePath;
  }

  updateEmployeeProfile(employeeId, oldName, newName) {
    const oldSheetName = oldName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 31);
    const newSheetName = newName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 31);

    // Update Summary sheet
    const summaryWs = this.workbook.Sheets['Summary'];
    const summaryData = XLSX.utils.sheet_to_json(summaryWs, { header: 1 });
    
    for (let i = 1; i < summaryData.length; i++) {
      if (summaryData[i][0] === employeeId) {
        summaryData[i][1] = newName;
        break;
      }
    }
    
    this.workbook.Sheets['Summary'] = XLSX.utils.aoa_to_sheet(summaryData);

    // Rename sheet if name changed
    if (oldSheetName !== newSheetName && this.workbook.SheetNames.includes(oldSheetName)) {
      const worksheet = this.workbook.Sheets[oldSheetName];
      delete this.workbook.Sheets[oldSheetName];
      this.workbook.Sheets[newSheetName] = worksheet;
      
      const sheetIndex = this.workbook.SheetNames.indexOf(oldSheetName);
      this.workbook.SheetNames[sheetIndex] = newSheetName;
    }

    XLSX.writeFile(this.workbook, this.filePath);
  }

  getLeaveSummary(employeeId) {
    const summaryWs = this.workbook.Sheets['Summary'];
    const summaryData = XLSX.utils.sheet_to_json(summaryWs, { header: 1 });
    
    for (let i = 1; i < summaryData.length; i++) {
      if (summaryData[i][0] === employeeId) {
        return {
          employeeId: summaryData[i][0],
          employeeName: summaryData[i][1],
          totalLeaves: summaryData[i][2],
          leavesTaken: summaryData[i][3],
          leavesRemaining: summaryData[i][4]
        };
      }
    }
    
    return null;
  }

  getAllEmployeesLeaveStatus() {
    const summaryWs = this.workbook.Sheets['Summary'];
    const summaryData = XLSX.utils.sheet_to_json(summaryWs, { header: 1 });
    
    return summaryData.slice(1).map(row => ({
      employeeId: row[0],
      employeeName: row[1],
      totalLeaves: row[2],
      leavesTaken: row[3],
      leavesRemaining: row[4]
    }));
  }
}

module.exports = ExcelManager;
