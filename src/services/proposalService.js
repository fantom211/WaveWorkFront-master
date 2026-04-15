import { API_PROPOSAL } from './ApiConsts';
import { USER_ID } from './ApiConsts';

export const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'X-User-Id': USER_ID,
  };
};

export const proposalService = {
  async createProposal(taskId) {
    try {
      const response = await fetch(`${API_PROPOSAL}/api/proposals`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          taskId: taskId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка отправки отклика');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  },

  async getTaskProposals(taskId, page = 1, limit = 18) {
    try {
      const response = await fetch(
        `${API_PROPOSAL}/api/proposals/task/${taskId}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: getHeaders(),
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки откликов');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching task proposals:', error);
      throw error;
    }
  },

  async getUserProposals(page = 1, limit = 18) {
    try {
      const response = await fetch(`${API_PROPOSAL}/api/proposals/my?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки ваших откликов');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user proposals:', error);
      throw error;
    }
  },
};