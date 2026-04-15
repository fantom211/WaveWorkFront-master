import React, { useEffect, useState, useCallback } from 'react';
import TaskCardResponse from '../components/TaskCardResponse';
import AddTaskModal from '../components/AddTaskModal';
import { taskService } from '../services/taskService';
import { proposalService } from '../services/proposalService';

function RepliesPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadUserTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskService.getUserTasks();
      const tasksData = response.data || [];
      const pagination = response.pagination || response.meta || {};

      setTotalPages(pagination.totalPages || pagination.total_pages || 1);
      setTotalItems(pagination.totalItems || pagination.total_items || tasksData.length);

      const tasksWithProposalsAndContacts = await loadProposalsAndContactsForTasks(tasksData);

      setTasks(tasksWithProposalsAndContacts);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки ваших задач');
      console.error('Failed to load user tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProposalsAndContactsForTasks = async (tasksList) => {
    if (!tasksList || tasksList.length === 0) return [];

    try {
      const tasksWithDetails = await Promise.all(
        tasksList.map(async (task) => {
          if (!task || !task.id) {
            console.error('Invalid task object:', task);
            return { ...task, responses: [] };
          }

          try {
            const proposalsResponse = await proposalService.getTaskProposals(task.id, 1, 100);
            const proposals =
              proposalsResponse?.items || proposalsResponse?.data || proposalsResponse || [];

            const proposalsWithContacts = await Promise.all(
              proposals.map(async (proposal) => {
                if (!proposal.executorId) {
                  return { ...proposal, contact: null };
                }

                try {
                  const contact = await taskService.getUserContact(proposal.executorId);
                  return {
                    ...proposal,
                    contact: contact,
                  };
                } catch (contactError) {
                  console.warn(
                    `Failed to load contact for executor ${proposal.executorId}:`,
                    contactError,
                  );
                  return { ...proposal, contact: null };
                }
              }),
            );

            return {
              ...task,
              responses: proposalsWithContacts,
            };
          } catch (err) {
            console.error(`Failed to load proposals for task ${task.id}:`, err);
            return { ...task, responses: [] };
          }
        }),
      );

      return tasksWithDetails;
    } catch (err) {
      console.error('Error loading proposals and contacts:', err);
      return tasksList;
    }
  };

  useEffect(() => {
    loadUserTasks();
  }, [loadUserTasks, currentPage]);

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleAddTaskSubmit = async (taskData) => {
    try {
      const taskToCreate = {
        ...taskData,
        deadline: taskData.deadline ? new Date(taskData.deadline).toISOString() : null,
      };

      const createdTask = await taskService.createTask(taskToCreate);

      setTasks((prevTasks) => [createdTask, ...prevTasks]);
      setTotalItems((prev) => prev + 1);

      window.location.reload();
    } catch (err) {
      alert('Ошибка добавления задачи: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!taskId) {
      alert('Ошибка: идентификатор задачи не указан');
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      setTasks((prevTasks) => {
        const newTasks = prevTasks.filter((task) => task?.id !== taskId);
        if (newTasks.length === 0) {
          setTotalItems(0);
        } else {
          setTotalItems((prev) => prev - 1);
        }
        return newTasks;
      });
    } catch (err) {
      alert('Ошибка удаления задачи: ' + err.message);
    }
  };

  const handleEditTask = async (updatedTask) => {
    if (!updatedTask || !updatedTask.id) {
      alert('Ошибка: некорректные данные задачи');
      return;
    }

    try {
      const taskToUpdate = {
        ...updatedTask,
        deadline: updatedTask.deadline ? new Date(updatedTask.deadline).toISOString() : null,
      };

      const result = await taskService.updateTask(taskToUpdate.id, taskToUpdate);

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task?.id === result.id) {
            return {
              ...result,
              responses: task.responses || [],
            };
          }
          return task;
        }),
      );

      return result;
    } catch (err) {
      console.error('Update error:', err);
      alert('Ошибка обновления задачи: ' + err.message);
      throw err;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button
          className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Назад
        </button>

        {startPage > 1 && (
          <>
            <button className="page-btn" onClick={() => handlePageChange(1)}>
              1
            </button>
            {startPage > 2 && <span className="page-dots">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="page-dots">...</span>}
            <button className="page-btn" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Вперед →
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <div className="page-title">Мои задачи</div>
          <div className="page-subtitle">Загрузка ваших задач...</div>
        </div>
        <div className="vacancies-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка задач...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="page-header">
          <div className="page-title">Мои задачи</div>
          <div className="page-subtitle">Ошибка загрузки</div>
        </div>
        <div className="vacancies-empty">
          <div className="vacancies-empty-title">Ошибка загрузки</div>
          <div className="vacancies-empty-text">{error}</div>
          <button className="btn-primary" onClick={loadUserTasks} style={{ marginTop: '20px' }}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-title">Мои задачи</div>
        <div className="page-subtitle">
          Здесь отображаются все ваши опубликованные задачи и отклики соискателей
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="vacancies-empty">
          <div className="vacancies-empty-title">У вас пока нет задач</div>
          <div className="vacancies-empty-text">
            Нажмите кнопку "Добавить задачу", чтобы создать первую задачу
          </div>
        </div>
      ) : (
        <>
          <div className="tasks-grid">
            {tasks.map((task) =>
              task && task.id ? (
                <TaskCardResponse
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              ) : null,
            )}
          </div>

          <div className="pagination-info">
            Страница {currentPage} из {totalPages} • Показано {tasks.length} из {totalItems} задач
          </div>

          {renderPagination()}
        </>
      )}

      <div className="add-task-container">
        <button className="btn-add-task" onClick={handleAddTask}>
          ➕ Добавить задачу
        </button>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={handleCloseModal} onAdd={handleAddTaskSubmit} />
    </div>
  );
}

export default RepliesPage;
