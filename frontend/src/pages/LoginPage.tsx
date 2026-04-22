import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import BrandLogo from '../components/BrandLogo';
import { ApiClientError } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('nuxyel@sidia.dev');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/');
    } catch (errorValue) {
      if (errorValue instanceof ApiClientError) {
        setError(errorValue.details.length > 0 ? errorValue.details.join(' ') : errorValue.message);
      } else if (errorValue instanceof Error) {
        setError(errorValue.message);
      } else {
        setError('Unable to sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel login-panel--single">
        <div className="login-panel__brand">
          <BrandLogo compact />
          <p className="support-note">inventory system</p>
        </div>

        <div className="section-heading">
          <p className="section-heading__eyebrow">Sign In</p>
          <h1>Sign in to continue</h1>
          <p>Use the demo account below or your own credentials.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field field--full">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nuxyel@sidia.dev"
              autoComplete="email"
            />
          </label>

          <label className="field field--full">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password123"
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="button login-form__submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-panel__meta">
          <p className="support-note">Demo credentials: nuxyel@sidia.dev / password123</p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
