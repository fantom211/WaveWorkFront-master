import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import { taskService } from '../services/taskService';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 18;

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await taskService.getAllTasks(currentPage, limit);
        console.log('Response:', response);

        const tasksData = Array.isArray(response.data) ? response.data : [];

        setTasks(tasksData);

        setTotalItems(response.total || 0);
        setTotalPages(Math.ceil((response.total || 0) / limit));
      } catch (err) {
        setError(err.message || 'Ошибка загрузки задач');
        console.error('Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1 && totalItems <= 18) return null;

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
          <div className="page-title">Доступные задачи</div>
          <div className="page-subtitle">Загрузка задач...</div>
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
          <div className="page-title">Доступные задачи</div>
          <div className="page-subtitle">Ошибка загрузки</div>
        </div>
        <div className="vacancies-empty">
          <div className="vacancies-empty-title">Ошибка загрузки</div>
          <div className="vacancies-empty-text">{error}</div>
          <button className="btn-primary" onClick={() => setCurrentPage(1)}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-title">Доступные задачи</div>
        <div className="page-subtitle">Здесь отображаются все доступные задачи</div>
      </div>

      {tasks.length === 0 ? (
        <div className="vacancies-empty">
          <div className="vacancies-empty-title">Нет доступных задач</div>
          <div className="vacancies-empty-text">Пока нет ни одной задачи. Загляните позже!</div>
        </div>
      ) : (
        <>
          <div className="vacancies-grid">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {renderPagination()}

          <div className="pagination-info">
            Страница {currentPage} из {totalPages} • Показано {tasks.length} из {totalItems} задач
          </div>
        </>
      )}
    </div>
  );
}

export default TasksPage;