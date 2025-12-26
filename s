const SHEET_NAME = "Transactions";
const SECRET_TOKEN = "694ec953e60c832280e4316f7d02b261";

function doPost(e) {
  try {
    const token = e.parameter.token;
    if (token !== SECRET_TOKEN) {
      return createCorsResponse({ error: "Unauthorized" }, 401);
    }

    // Get action from parameters
    const action = e.parameter.action;
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return createCorsResponse({ error: "Sheet not found. Please create a sheet named 'Transactions'" }, 404);
    }

    switch (action) {
      case "fetch":
        return fetchAll(sheet);

      case "add":
        sheet.appendRow([
          e.parameter.id,
          e.parameter.date,
          Number(e.parameter.amount) || 0,
          e.parameter.note || ""
        ]);
        return createCorsResponse({ success: true });

      case "update":
        return updateRow(sheet, e.parameter);

      case "delete":
        return deleteRow(sheet, e.parameter.id);

      default:
        return createCorsResponse({ error: "Invalid action" }, 400);
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return createCorsResponse({ error: error.toString() }, 500);
  }
}

function doGet(e) {
  const token = e.parameter.token;
  if (token !== SECRET_TOKEN) {
    return createCorsResponse({ error: "Unauthorized" }, 401);
  }
  
  return createCorsResponse({ 
    message: "Finance Tracker API is working", 
    timestamp: new Date().toISOString(),
    sheetName: SHEET_NAME
  });
}

function fetchAll(sheet) {
  try {
    const range = sheet.getDataRange();
    if (range.getNumRows() <= 1) {
      // Only header row or empty sheet
      return createCorsResponse([]);
    }
    
    const rows = range.getValues();
    rows.shift(); // Remove header row
    
    const transactions = rows.map(r => ({
      id: r[0],
      date: r[1],
      amount: Number(r[2]) || 0,
      note: r[3] || ""
    })).filter(tx => tx.id); // Filter out empty rows
    
    return createCorsResponse(transactions);
  } catch (error) {
    console.error('Error in fetchAll:', error);
    return createCorsResponse({ error: error.toString() }, 500);
  }
}

function updateRow(sheet, params) {
  try {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === params.id) {
        sheet.getRange(i + 1, 2, 1, 3).setValues([[
          params.date,
          Number(params.amount) || 0,
          params.note || ""
        ]]);
        return createCorsResponse({ success: true });
      }
    }
    return createCorsResponse({ error: "Transaction not found" }, 404);
  } catch (error) {
    console.error('Error in updateRow:', error);
    return createCorsResponse({ error: error.toString() }, 500);
  }
}

function deleteRow(sheet, id) {
  try {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === id) {
        sheet.deleteRow(i + 1);
        return createCorsResponse({ success: true });
      }
    }
    return createCorsResponse({ error: "Transaction not found" }, 404);
  } catch (error) {
    console.error('Error in deleteRow:', error);
    return createCorsResponse({ error: error.toString() }, 500);
  }
}

function createCorsResponse(data, status = 200) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  return output;
}