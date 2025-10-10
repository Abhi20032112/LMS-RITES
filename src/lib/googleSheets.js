import { gapi } from 'gapi-script';

// Replace with your Google Cloud Console OAuth client ID
// Instructions: Go to Google Cloud Console > APIs & Services > Credentials > Create OAuth 2.0 Client ID
// Enable Google Sheets API in APIs & Services > Library
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const API_KEY = 'YOUR_API_KEY_HERE'; // Optional, for public data
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let isGapiLoaded = false;

export const initGapi = () => {
  return new Promise((resolve, reject) => {
    if (isGapiLoaded) {
      resolve();
      return;
    }

    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        });
        isGapiLoaded = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const signIn = () => {
  return gapi.auth2.getAuthInstance().signIn();
};

export const signOut = () => {
  return gapi.auth2.getAuthInstance().signOut();
};

export const isSignedIn = () => {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};

export const pushUsersToSheet = async (spreadsheetId, users) => {
  if (!isSignedIn()) {
    throw new Error('User not signed in');
  }

  const values = [
    ['Employee ID', 'Name', 'Designation', 'Role', 'CL Balance', 'CO Balance'], // Header
    ...users.map(user => [user.empId, user.name, user.designation, user.role, user.clBalance, user.coBalance])
  ];

  try {
    // Clear existing data in "Users" sheet
    await gapi.client.sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheetId,
      range: 'Users!A1:F',
    });

    // Append new data
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'Users!A1',
      valueInputOption: 'RAW',
      resource: { values },
    });
  } catch (error) {
    throw new Error(`Failed to push users data: ${error.message}`);
  }
};

export const pushRequestsToSheet = async (spreadsheetId, requests) => {
  if (!isSignedIn()) {
    throw new Error('User not signed in');
  }

  const values = [
    ['Leave ID', 'Employee ID', 'Name', 'Designation', 'Leave Type', 'From', 'To', 'Days', 'Site Incharge', 'HR', 'SBU Head', 'Final Status'], // Header
    ...requests.map(req => [
      req.leaveId,
      req.empId,
      req.name,
      req.designation,
      req.leaveType,
      new Date(req.from).toLocaleDateString(),
      new Date(req.to).toLocaleDateString(),
      req.days,
      req.siteIncharge,
      req.hr,
      req.sbuHead,
      req.finalStatus
    ])
  ];

  try {
    // Clear existing data in "LeaveRequests" sheet
    await gapi.client.sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheetId,
      range: 'LeaveRequests!A1:L',
    });

    // Append new data
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'LeaveRequests!A1',
      valueInputOption: 'RAW',
      resource: { values },
    });
  } catch (error) {
    throw new Error(`Failed to push requests data: ${error.message}`);
  }
};
