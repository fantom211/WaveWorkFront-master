import { API_BASE_URL} from './ApiConsts';

export const authService = {
  /**
   * Вход в систему
   * @param {string} username - Имя пользователя
   * @param {string} password - Пароль
   * @returns {Promise} - Результат входа
   */
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/auth/login`, {
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

    /**
   * Регистрация нового пользователя
   * @param {string} username - Имя пользователя
   * @param {string} password - Пароль
   * @returns {Promise} - Результат регистрации
   */
  async register(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/auth/registration`, {
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

    /**
   * Выход из системы (удаление сессии на сервере)
   * @returns {Promise} - Результат выхода
   */
  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/auth/logout`, {
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

    /**
   * Очистка локальных данных пользователя
   */
  clearLocalData() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userLogin');
    localStorage.removeItem('userId');
  },


  /**
   * Проверка авторизации
   * @returns {boolean} - Авторизован ли пользователь
   */
  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
};