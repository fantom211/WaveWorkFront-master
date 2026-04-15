import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/pages/LoginPage.scss';

function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!login || !password) {
      setError('Пожалуйста, заполните все поля');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login(login, password);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userLogin', login);
      if (response.userId) {
        localStorage.setItem('userId', response.userId);
      }

      const savedProfile = localStorage.getItem('profileData');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (!profile.username) {
          profile.username = login;
          localStorage.setItem('profileData', JSON.stringify(profile));
        }
      } else {
        localStorage.setItem('profileData', JSON.stringify({ username: login }));
      }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Неверный логин или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">🌊 WaveWork</div>
            <h2>Вход в аккаунт</h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="login">Логин</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="login"
                  placeholder="Введите логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </button>

            <div className="register-link">
              <span>
                Нет аккаунта?{' '}
                <Link to="/register" className="register-text">
                  Зарегистрироваться
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
