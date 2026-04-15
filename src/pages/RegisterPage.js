import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/pages/RegisterPage.scss';

function RegisterPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!login || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    if (password.length < 3) {
      setError('Пароль должен содержать минимум 3 символа');
      setIsLoading(false);
      return;
    }

    if (login.length < 3) {
      setError('Логин должен содержать минимум 3 символа');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register(login, password);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userLogin', login);
      if (response.userId) {
        localStorage.setItem('userId', response.userId);
      }
      localStorage.setItem('profileData', JSON.stringify({ username: login }));

      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка регистрации. Попробуйте другой логин');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-logo">🌊 WaveWork</div>
            <h2>Регистрация</h2>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="login">Логин</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="login"
                  placeholder="Введите логин (мин. 3 символа)"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Введите пароль (мин. 3 символа)"
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

            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <div className="login-link">
              <span>Уже есть аккаунт?</span>
              <Link to="/login" className="login-link-button">
                Войти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
