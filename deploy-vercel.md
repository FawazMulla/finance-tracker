# Deploy to Vercel with Favicon Fix

## Quick Deployment Steps

### 1. Verify Files
Make sure these files exist in your project root:
```
✅ favicon.ico
✅ favicon-16x16.png
✅ favicon-32x32.png
✅ favicon-48x48.png
✅ apple-touch-icon.png
✅ android-chrome-192x192.png
✅ android-chrome-512x512.png
✅ vercel.json (updated)
✅ .vercelignore (created)
```

### 2. Deploy Commands

#### Using Vercel CLI:
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy with force flag to clear cache
vercel --prod --force
```

#### Using Git (if connected to GitHub):
```bash
# Commit all changes
git add .
git commit -m "Fix favicon issues for Vercel deployment"
git push origin main

# Vercel will auto-deploy from GitHub
```

### 3. Post-Deployment Verification

1. **Check favicon directly:**
   - Visit: `https://your-app.vercel.app/favicon.ico`
   - Should show your custom favicon, not a 404

2. **Test in browser:**
   - Open your deployed app
   - Check browser tab for custom favicon
   - Hard refresh (Ctrl+Shift+R) to bypass cache

3. **Mobile PWA test:**
   - Open on mobile device
   - Add to home screen
   - Check if custom icon appears

### 4. If Favicon Still Not Working

1. **Clear Vercel cache:**
   ```bash
   vercel --prod --force
   ```

2. **Try incognito mode:**
   - Browsers cache favicons aggressively
   - Test in private/incognito window

3. **Check Network tab:**
   - Open browser dev tools
   - Look for favicon requests
   - Verify no 404 errors

4. **Manual cache bust:**
   - Add version parameter: `/favicon.ico?v=2`
   - Update HTML links temporarily

## Environment Variables

Don't forget to set your environment variables in Vercel dashboard:

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add:
   - `VITE_API_URL`: Your Google Apps Script URL
   - `VITE_API_TOKEN`: Your secret token

## Troubleshooting

### Common Issues:

1. **Favicon shows as generic icon:**
   - Clear browser cache completely
   - Try different browser
   - Check if favicon.ico is actually loading

2. **404 on favicon.ico:**
   - Verify file exists in root directory
   - Check vercel.json routing configuration
   - Ensure .vercelignore includes favicon files

3. **PWA icons not working:**
   - Check manifest.json icon paths
   - Verify PNG files are properly sized
   - Test PWA installation flow

### Debug Commands:

```bash
# Check if favicon exists locally
ls -la favicon*

# Test favicon URL after deployment
curl -I https://your-app.vercel.app/favicon.ico

# Check Vercel deployment logs
vercel logs
```

## Success Indicators

✅ Browser tab shows your custom favicon  
✅ No 404 errors in browser console  
✅ PWA icons work on mobile  
✅ Favicon persists after hard refresh  
✅ Works across different browsers  
✅ Appears correctly in bookmarks