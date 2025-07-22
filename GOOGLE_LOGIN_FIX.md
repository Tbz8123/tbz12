# Google Login Issue Fix

## Problem
The "Continue with Google" button is not working because `localhost:3000` is not authorized in the Firebase console.

## Solution
You need to add `localhost:3000` to the authorized domains in your Firebase console:

### Steps to Fix:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `resumebuilder-d1a8d`

2. **Navigate to Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "Settings" tab
   - Click on "Authorized domains"

3. **Add localhost to Authorized Domains**
   - Click "Add domain"
   - Add: `localhost`
   - Save the changes

4. **Alternative: Add specific localhost with port**
   - You can also try adding: `localhost:3000`

### Current Firebase Configuration
- Project ID: `resumebuilder-d1a8d`
- Auth Domain: `resumebuilder-d1a8d.firebaseapp.com`

### Expected Authorized Domains Should Include:
- `resumebuilder-d1a8d.firebaseapp.com` (already there)
- `localhost` (needs to be added)
- Any production domains you plan to use

### Testing After Fix:
1. Save the Firebase console changes
2. Refresh your application at `http://localhost:3000/login`
3. Try clicking "Continue with Google" again
4. The Google OAuth popup should now work properly

### Common Error Messages (if not fixed):
- "This app is blocked"
- "Error 400: redirect_uri_mismatch"
- "The redirect URI in the request does not match the ones authorized for the OAuth client"

Once you add `localhost` to the authorized domains in Firebase console, the Google login should work correctly.