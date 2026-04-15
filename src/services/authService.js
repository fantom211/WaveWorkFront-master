import { API_AUTH } from './ApiConsts';

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch(`${API_AUTH}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка входа. Проверьте логин и пароль');
      }

      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  async register(username, password) {
    try {
      const response = await fetch(`${API_AUTH}/auth/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Ошибка регистрации. Возможно, пользователь уже существует',
        );
      }

      return data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const response = await fetch(`${API_AUTH}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('Logout API error:', errorData.message || 'Ошибка выхода');
      }

      this.clearLocalData();

      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      this.clearLocalData();
      return { success: true };
    }
  },

  clearLocalData() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userLogin');
    localStorage.removeItem('userId');
  },

  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
};