# React JWT Authentication with Access & Refresh Tokens

A secure React single-page application implementing JWT-based authentication with access tokens and refresh tokens. Built with React, TypeScript, Axios, React Query, and React Hook Form.

## Features

- ✅ JWT Access Token (stored in memory) and Refresh Token (stored in localStorage)
- ✅ Automatic token refresh on 401 Unauthorized responses
- ✅ Axios interceptors for request/response handling
- ✅ React Query for state management and API calls
- ✅ React Hook Form with validation for login form
- ✅ Protected routes with authentication checks
- ✅ Clean error handling and user feedback
- ✅ Modern, responsive UI

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client with interceptors
- **@tanstack/react-query** - Server state management
- **React Hook Form** - Form handling and validation
- **Express.js** - Mock backend server

## Project Structure

```
jwt/
├── src/
│   ├── components/        # React components
│   │   ├── Login.tsx     # Login form component
│   │   ├── Dashboard.tsx # Protected dashboard
│   │   └── ProtectedRoute.tsx # Route guard
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.ts    # Authentication hooks
│   ├── lib/              # Utilities
│   │   └── api.ts        # Axios instance and API functions
│   ├── types/            # TypeScript types
│   │   └── auth.ts       # Authentication types
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── server/               # Backend server
│   └── index.js          # Express server with JWT endpoints
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server** (in one terminal):
   ```bash
   npm run server
   ```
   The server will run on `http://localhost:5000`

4. **Start the development server** (in another terminal):
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`

## Demo Credentials

Use these credentials to test the application:

- **Email:** `user@example.com`
- **Password:** `password123`

Alternative:
- **Email:** `admin@example.com`
- **Password:** `admin123`

## How It Works

### Authentication Flow

1. **Login:** User submits credentials → Server returns access token (15min) and refresh token (7 days)
2. **Access Token:** Stored in memory (JavaScript variable) → Attached to all API requests
3. **Refresh Token:** Stored in localStorage → Used to get new access tokens
4. **Auto Refresh:** On 401 response → Interceptor automatically refreshes access token
5. **Logout:** Clears both tokens and redirects to login

### Token Management

- **Access Token:** Lives in memory during session (15 minutes expiry)
- **Refresh Token:** Persists in localStorage (7 days expiry)
- **Automatic Refresh:** Axios response interceptor handles 401 errors
- **Logout:** Clears all tokens and invalidates queries

### Protected Routes

The `ProtectedRoute` component:
- Checks for valid tokens
- Fetches user data using React Query
- Redirects to login if unauthenticated
- Shows loading state during authentication check

## API Endpoints

The mock backend provides these endpoints:

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (invalidate refresh token)
- `GET /api/user/profile` - Get authenticated user profile (protected)

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Deploy to Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build the project: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`

### Deploy to GitHub Pages

See the [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html#github-pages) for details.

**Note:** For production deployment, you'll need to:
- Update the API base URL in `src/lib/api.ts` to point to your backend
- Set up a real backend server (the included server is for development only)
- Use environment variables for API endpoints

## Public Hosting URL

After deployment, update this section with your public URL:

**Live URL:** [Your deployment URL here]

## Features Explained

### Axios Interceptors

- **Request Interceptor:** Adds `Authorization: Bearer <token>` header to all requests
- **Response Interceptor:** Catches 401 errors, refreshes token, and retries the request

### React Query Integration

- `useMutation` for login/logout actions
- `useQuery` for fetching user profile
- Automatic cache invalidation on authentication state changes

### React Hook Form

- Email validation (regex pattern)
- Password validation (minimum length)
- Real-time error messages
- Form state management

### Error Handling

- Network errors
- Invalid credentials
- Expired tokens (automatic refresh)
- Refresh token expiration (automatic logout)

## Development Notes

- Access tokens expire after 15 minutes (configurable in `server/index.js`)
- Refresh tokens expire after 7 days (configurable in `server/index.js`)
- The server uses in-memory token storage (use Redis/Database in production)
- CORS is enabled for development

## License

MIT

## Author

Built as a learning project for JWT authentication in React applications.

