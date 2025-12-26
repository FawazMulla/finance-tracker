const SHEET_NAME = "Transactions";
const SECRET_TOKEN = "694ec953e60c832280e4316f7d02b261";

function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('Received POST request:', e);
    
    const token = e.parameter.token;
    if (token !== SECRET_TOKEN) {
      return jsonResponse({ error: "Unauthorized" });
    }

    const action = e.parameter.action;
    console.log('Action:', action);
    
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return jsonResponse({ error: "Sheet not found. Please create a sheet named 'Transactions'" });
    }

    switch (action) {
      case "fetch":
        return fetchAll(sheet);

      case "add":
        return addTransaction(sheet, e.parameter);

      case "update":
        return updateTransaction(sheet, e.parameter);

      case "delete":
        return deleteTransaction(sheet, e.parameter.id);

      default:
        return jsonResponse({ error: "Invalid action: " + action });
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return jsonResponse({ error: "Server error: " + error.toString() });
  }
}

function doGet(e) {
  try {
    const token = e.parameter.token;
    if (token !== SECRET_TOKEN) {
      return jsonResponse({ error: "Unauthorized" });
    }
    
    return jsonResponse({ 
      message: "Finance Tracker API is working", 
      timestamp: new Date().toISOString(),
      sheetName: SHEET_NAME,
      status: "OK"
    });
  } catch (error) {
    console.error('Error in doGet:', error);
    return jsonResponse({ error: error.toString() });
  }
}

function fetchAll(sheet) {
  try {
    const range = sheet.getDataRange();
    const numRows = range.getNumRows();
    
    console.log('Sheet has', numRows, 'rows');
    
    if (numRows <= 1) {
      // Only header row or empty sheet
      return jsonResponse([]);
    }
    
    const rows = range.getValues();
    console.log('Raw rows:', rows);
    
    // Remove header row
    rows.shift();
    
    const transactions = rows
      .filter(row => row[0]) // Filter out empty rows
      .map(row => ({
        id: row[0] ? row[0].toString() : '',
        date: row[1] ? row[1].toString() : new Date().toISOString(),
        amount: Number(row[2]) || 0,
        note: row[3] ? row[3].toString() : ''
      }));
    
    console.log('Processed transactions:', transactions);
    return jsonResponse(transactions);
  } catch (error) {
    console.error('Error in fetchAll:', error);
    return jsonResponse({ error: "Failed to fetch data: " + error.toString() });
  }
}

function addTransaction(sheet, params) {
  try {
    console.log('Adding transaction:', params);
    
    const row = [
      params.id || '',
      params.date || new Date().toISOString(),
      Number(params.amount) || 0,
      params.note || ''
    ];
    
    console.log('Adding row:', row);
    sheet.appendRow(row);
    
    return jsonResponse({ success: true, message: "Transaction added" });
  } catch (error) {
    console.error('Error in addTransaction:', error);
    return jsonResponse({ error: "Failed to add transaction: " + error.toString() });
  }
}

function updateTransaction(sheet, params) {
  try {
    console.log('Updating transaction:', params);
    
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString() === params.id) {
        sheet.getRange(i + 1, 2, 1, 3).setValues([[
          params.date || new Date().toISOString(),
          Number(params.amount) || 0,
          params.note || ""
        ]]);
        return jsonResponse({ success: true, message: "Transaction updated" });
      }
    }
    return jsonResponse({ error: "Transaction not found" });
  } catch (error) {
    console.error('Error in updateTransaction:', error);
    return jsonResponse({ error: "Failed to update transaction: " + error.toString() });
  }
}

function deleteTransaction(sheet, id) {
  try {
    console.log('Deleting transaction:', id);
    
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString() === id) {
        sheet.deleteRow(i + 1);
        return jsonResponse({ success: true, message: "Transaction deleted" });
      }
    }
    return jsonResponse({ error: "Transaction not found" });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    return jsonResponse({ error: "Failed to delete transaction: " + error.toString() });
  }
}

function jsonResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  return output;
}