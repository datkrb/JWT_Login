import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { getRefreshToken } from '../lib/api';
import { LoginCredentials } from '../types/auth';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
  const { mutate: login, isPending, error } = useLogin();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Please sign in to your account</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          {error && (
            <div className="error-banner">
              {(error as any).response?.data?.error || 'Login failed. Please try again.'}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isPending}
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-info">
          <p>Demo credentials:</p>
          <p>Email: user@example.com | Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

