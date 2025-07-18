import { google } from "googleapis";

// Helper function to authenticate with Google Sheets API
export const authenticateGoogleSheets = () => {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
};

// Fetch user data from Google Sheets based on email and password
export const getUserData = async (email: string, password: string) => {
  const auth = authenticateGoogleSheets();
  const sheets = google.sheets({ auth, version: "v4" });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A2:C1000", // Email, Password, Role columns
  });

  const rows = response.data.values;

  return rows?.find((row) => row[0] === email && row[1] === password);
};

// Fetch data from Google Sheets
export const fetchSheetData = async () => {
  const auth = authenticateGoogleSheets();
  const sheets = google.sheets({ auth, version: "v4" });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A2:R1000", // Adjust range to include all columns
  });

  return response.data.values;
};

// Transform rows into an array of objects
export const transformRowsToData = (rows: string[][]) => {
  return rows.map((row) => ({
    email: row[0],
    password: row[1],
    role: row[2],
    studentId: row[3],
    batch: row[4],
    sy: row[5],
    year: row[6],
    category: row[7],
    status: row[8],
    lastName: row[9],
    firstName: row[10],
    middleName: row[11],
    school: row[12],
    course: row[13],
    duration: row[14],
    mobileNumber: row[15],
    facebook: row[16],
    address: row[17],
  }));
};

// Function to submit user data to Google Sheets
export const submitUserData = async (name: string, email: string) => {
  const auth = authenticateGoogleSheets();
  const sheets = google.sheets({ auth, version: "v4" });

  try {
    // Append user data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A2", // Starting from the second row, column A
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email]], // Adjust this based on your sheet's columns
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting user data to Google Sheets:", error);
    throw new Error("Error submitting user data to Google Sheets");
  }
};
