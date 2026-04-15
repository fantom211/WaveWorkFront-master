import { API_PROFILE, API_WORK } from './ApiConsts';
import { USER_ID } from './ApiConsts';

export const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Id': USER_ID,
  };

  return headers;
};

export const taskService = {
  async getAllTasks(page = 1, limit = 18) {
    try {
      const response = await fetch(`${API_WORK}/api/tasks?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {},
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки задач');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  async getUserContact(userUuid) {
    try {
      const response = await fetch(`${API_PROFILE}/profiles/me/contact/${userUuid}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки контактов');
      }

      const contactData = await response.json();
      return contactData;
    } catch (error) {
      console.error(`Error loading contact for user ${userUuid}:`, error);
      throw error;
    }
  },

  async getUserTasks() {
    try {
      const response = await fetch(`${API_WORK}/api/tasks/my`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки ваших задач');
      }

      const tasksData = await response.json();

      return tasksData;
    } catch (error) {
      console.error('Error loading user tasks:', error);
      throw error;
    }
  },

  async getTaskById(id) {
    try {
      const response = await fetch(`${API_WORK}/api/tasks/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки задачи');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  async createTask(taskData) {
    try {
      const response = await fetch(`${API_WORK}/api/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          budget: taskData.budget,
          category: taskData.category || null,
          specialization: taskData.specialization,
          technologies: taskData.technologies || [],
          deadline: taskData.deadline || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка создания задачи');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(id, taskData) {
    try {
      const response = await fetch(`${API_WORK}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          budget: taskData.budget,
          category: taskData.category || null,
          specialization: taskData.specialization,
          technologies: taskData.technologies || [],
          deadline: taskData.deadline || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка обновления задачи');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(id) {
    try {
      const response = await fetch(`${API_WORK}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка удаления задачи');
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};