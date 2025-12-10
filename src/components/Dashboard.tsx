import { useUser, useLogout } from '../hooks/useAuth';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { data: user, isLoading, error } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="loading">Loading user data...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="error-message">Failed to load user data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button 
            onClick={() => logout()} 
            className="logout-button"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        <div className="welcome-section">
          <div className="avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2>Welcome, {user.name}!</h2>
          <p className="user-email">{user.email}</p>
        </div>

        <div className="info-section">
          <h3>User Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user.name}</span>
            </div>
          </div>
        </div>

        <div className="status-section">
          <div className="status-badge">
            <span className="status-dot"></span>
            Authenticated
          </div>
          <p className="status-description">
            You are successfully authenticated. Your access token is stored in memory
            and your refresh token is stored securely in localStorage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

