import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Secret keys for tokens
const ACCESS_TOKEN_SECRET = 'your-access-token-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret-key-change-in-production';

// Mock user database
const users = [
  { id: '1', email: 'user@example.com', password: 'password123', name: 'John Doe' },
  { id: '2', email: 'admin@example.com', password: 'admin123', name: 'Jane Admin' }
];

// Store refresh tokens (in production, use Redis or database)
const refreshTokens = new Set();

app.use(cors());
app.use(express.json());

// Helper function to generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' } // Short-lived access token
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // Long-lived refresh token
  );
  
  refreshTokens.add(refreshToken);
  
  return { accessToken, refreshToken };
}

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  const { accessToken, refreshToken } = generateTokens(user);
  
  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

// Refresh token endpoint
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }
    
    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken });
  } catch (error) {
    refreshTokens.delete(refreshToken);
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});

// Protected route - Get user profile
app.get('/api/user/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }
  
  res.json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

