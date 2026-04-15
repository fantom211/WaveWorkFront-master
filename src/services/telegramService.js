import { API_BASE_URL } from './ApiConsts';

export const telegramService = {
  /**
   * Получение ссылки для привязки Telegram
   * @returns {Promise} - Результат запроса с ссылкой
   */
  async getTelegramLink() {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/bind/get-tg-link`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка получения ссылки для привязки Telegram');
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error getting Telegram link:', error);
      throw error;
    }
  },

  /**
   * Открытие ссылки для привязки Telegram
   * @param {string} link - Ссылка для привязки
   */
  openTelegramLink(link) {
    if (link) {
      window.open(link, '_blank');
    } else {
      console.error('Telegram link is empty');
    }
  },
};
