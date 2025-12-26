# Finance Tracker Setup Guide

## CORS Issue Fixed! 🎉

The CORS (Cross-Origin Resource Sharing) error has been resolved by:
- ✅ Switching from JSON to FormData (avoids CORS preflight)
- ✅ Updated Google Apps Script to handle FormData
- ✅ Removed custom headers that trigger CORS

## Google Sheets Setup

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename it to "Finance Tracker" (or any name you prefer)
4. Create a sheet named **"Transactions"** (exact name required)
5. Add headers in row 1: **ID**, **Date**, **Amount**, **Note**

### Step 2: Deploy Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with the content from the `s` file
4. Save the project (Ctrl+S)
5. Click **Deploy** → **New Deployment**
6. Choose type: **Web app**
7. Set execute as: **Me**
8. Set access: **Anyone** (important!)
9. Click **Deploy**
10. **IMPORTANT**: After any code changes, you must create a **NEW DEPLOYMENT** (not update existing)

### Step 3: Test the Setup
1. Open `debug.html` in your browser
2. Click "Test API Connection" - should show success with empty array `[]`
3. Click "Test Add Transaction" - should add a test transaction
4. Check your Google Sheet - the transaction should appear
5. Click "Refresh Balance" - should show the correct total

## Troubleshooting

### If you still get CORS errors:
1. **Create a NEW deployment** (don't update existing one)
2. Make sure the Web app URL in app.js matches your NEW deployment URL
3. Ensure "Anyone" access is selected in deployment settings

### If API Test Fails:
- Check the Web app URL in app.js matches your deployment URL
- Ensure the Google Apps Script is deployed with "Anyone" access
- Verify the sheet is named exactly "Transactions"
- Try creating a NEW deployment instead of updating existing

### If Balance Shows ₹0:
- Open browser console (F12) and check for errors
- Use debug.html to test API calls
- Verify transactions exist in your Google Sheet
- Make sure the sheet has the correct headers: ID, Date, Amount, Note

### Common Issues:
1. **CORS Error**: Create a NEW deployment (don't update existing)
2. **Unauthorized Error**: Check that the TOKEN matches in both files
3. **Sheet Not Found**: Ensure sheet is named "Transactions" (case-sensitive)
4. **Empty Response**: Check if there are any transactions in the sheet

## Testing Steps

1. **Open debug.html** - This will help identify any API issues
2. **Test API connection** - Should return empty array `[]` initially
3. **Add test transaction** - Should appear in Google Sheets immediately
4. **Refresh balance** - Should show correct total
5. **Open main app** - Should now work without CORS errors

## Important Notes

- **Always create NEW deployments** after changing Google Apps Script code
- The app now uses FormData instead of JSON to avoid CORS issues
- No custom headers are sent, preventing CORS preflight requests
- All API calls should work from any domain now

The CORS issue should now be completely resolved! 🚀