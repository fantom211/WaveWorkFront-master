import { API_PROPOSAL } from './ApiConsts';

export const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  return headers;
};

export const proposalService = {
  async createProposal(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proposal/api/proposals`, {
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
        `${API_BASE_URL}/proposal/api/proposals/task/${taskId}?page=${page}&limit=${limit}`,
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
      const response = await fetch(`${API_BASE_URL}/proposal/api/proposals/my?page=${page}&limit=${limit}`, {
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

  async acceptProposal(proposalId) {
    try {
       const response = await fetch(`${API_BASE_URL}/proposal/api/proposals/${proposalId}/accept`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка принятия отклика');
      }

      if (response.status === 204) {
        return true;
      }

      const responseText = await response.text();
      return responseText ? JSON.parse(responseText) : true;
    } catch (error) {
      console.error('Error accepting proposal:', error);
      throw error;
    }
  },
};