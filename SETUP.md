# Quick Setup Guide

## Installation

```bash
npm install
```

## Running the Application

You need to run both the backend server and frontend development server.

### Terminal 1 - Backend Server
```bash
npm run server
```
Server runs on `http://localhost:5000`

### Terminal 2 - Frontend Development Server
```bash
npm run dev
```
App runs on `http://localhost:3000`

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. You'll be redirected to `/login` page
3. Use demo credentials:
   - Email: `user@example.com`
   - Password: `password123`
4. After login, you'll be redirected to `/dashboard`
5. Test logout functionality
6. Try accessing `/dashboard` directly without login (should redirect to login)

## Token Expiration Testing

To test token refresh:
1. Login successfully
2. Wait 15 minutes (access token expires)
3. Make a request - should automatically refresh
4. Or modify server token expiry in `server/index.js` for faster testing

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

