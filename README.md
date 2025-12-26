# Finance Tracker PWA

A modern, responsive Progressive Web App for personal finance tracking with offline support.

## Features

✅ **Responsive Design**: Works perfectly on mobile, tablet, and desktop
✅ **Offline Support**: Add transactions even without internet connection
✅ **Real-time Sync**: Automatically syncs when back online
✅ **Secure**: Fixed XSS vulnerabilities and improved input validation
✅ **User-friendly**: Loading indicators, error messages, and success feedback
✅ **PWA**: Installable as a native app with service worker caching

## Improvements Made

### 🔒 Security Fixes
- Fixed XSS vulnerabilities in transaction history
- Added proper input validation and sanitization
- Implemented secure event handling

### 🎨 UI/UX Improvements
- Modern, responsive design with gradient backgrounds
- Loading indicators for all operations
- Error and success message feedback
- Online/offline status indicator
- Better form validation with visual feedback
- Improved accessibility with ARIA labels

### 🚀 Performance & Reliability
- Proper error handling throughout the app
- Request timeout handling (10 seconds)
- Debouncing to prevent duplicate submissions
- Better offline queue management
- Enhanced service worker caching

### 📱 Mobile Optimization
- Responsive grid layouts
- Touch-friendly button sizes
- Optimized for small screens
- Proper viewport configuration

## Usage

1. **Add Transaction**: Enter amount and optional note, then click Income (+) or Expense (-)
2. **View History**: Click "View History" to see all transactions
3. **Edit Transaction**: In history, modify amount/note and click Save
4. **Delete Transaction**: Click Delete button (with confirmation)
5. **Offline Mode**: App works offline and syncs when connection returns

## Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage**: IndexedDB for offline caching
- **Backend**: Google Apps Script with Google Sheets
- **PWA**: Service Worker for offline functionality

## Files

- `index.html` - Main app interface
- `history.html` - Transaction history page
- `app.js` - Core application logic and API calls
- `db.js` - IndexedDB operations for offline support
- `style.css` - Modern responsive styling
- `sw.js` - Service worker for PWA functionality
- `manifest.json` - PWA configuration
- `s` - Google Apps Script backend code

## Installation

1. Deploy the Google Apps Script (`s` file) to Google Apps Script
2. Create a Google Sheet with columns: ID, Date, Amount, Note
3. Update the API_URL in `app.js` with your deployed script URL
4. Serve the files from a web server
5. The app can be installed as a PWA on supported devices

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers with PWA support