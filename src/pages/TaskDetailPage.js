import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { proposalService } from '../services/proposalService';
import { getHeaders } from '../services/taskService';
import { API_BASE_URL } from '../services/ApiConsts';

function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [contacts, setContacts] = useState(null);

  const loadTask = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskService.getTaskById(id);
      const task = data.data || data;
      setTask(task);

      try {
        const contactResponse = await fetch(
          `${API_BASE_URL}/profile/profiles/me/contact/${task.createdByUserId}`,
          {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include',
          }
        );

        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          setContacts({
            phone: contactData.phone || null,
            email: contactData.email || null,
            telegram: contactData.telegramUsername || null,
          });
        } else {
          setContacts(null);
        }
      } catch (err) {
        console.warn('Failed to load contacts:', err);
        setContacts(null);
      }
    } catch (err) {
      setError(err.message || 'Ошибка загрузки задачи');
      console.error('Failed to load task:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await proposalService.createProposal(id);
    } catch (err) {
      alert('Ошибка отправки отклика: ' + err.message);
    } finally {
      setIsApplying(false);
    }
  };

  const formatBudget = (budget) => {
    if (!budget && budget !== 0) return 'не указан';
    const num = typeof budget === 'number' ? budget : parseFloat(budget);
    if (isNaN(num)) return 'не указан';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="back-nav">
          <Link to="/tasks" className="back-link">
            ← Назад к списку задач
          </Link>
        </div>
        <div className="task-detail-card">
          <div className="task-body" style={{ textAlign: 'center', padding: '60px' }}>
            <div className="loading-spinner"></div>
            <p>Загрузка задачи...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container">
        <div className="back-nav">
          <Link to="/tasks" className="back-link">
            ← Назад к списку задач
          </Link>
        </div>
        <div className="task-detail-card">
          <div className="task-body" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '1.2rem', color: '#f87171', marginBottom: '10px' }}>
              {error || 'Задача не найдена'}
            </div>
            <button className="btn-primary" onClick={loadTask} style={{ marginTop: '20px' }}>
              Повторить
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="back-nav">
        <Link to="/tasks" className="back-link">
          ← Назад к списку задач
        </Link>
      </div>
      <div className="task-detail-card">
        <div className="task-header">
          <div className="company-logo-large">{task.logo || '📋'}</div>
          <div className="task-title-section">
            <div className="company-name-large">{task.title || 'Без названия'}</div>
            <div className="job-title-large">{task.specialization || 'Без специализации'}</div>
            <div className="salary-large">{formatBudget(task.budget)}</div>
            {task.deadline && (
              <div className="deadline-large">Дедлайн: {formatDeadline(task.deadline)}</div>
            )}
          </div>
        </div>
        <div className="task-body">
          <div className="info-section">
            <div className="info-title">
              <span>🛠️</span> Стек технологий
            </div>
            <div className="tech-stack-large">
              {task.technologies && task.technologies.length > 0 ? (
                task.technologies.map((tech, idx) => (
                  <span className="tech-tag-large" key={idx}>
                    {tech.name}
                  </span>
                ))
              ) : (
                <span className="no-tech">Не указаны</span>
              )}
            </div>
          </div>
          <div className="info-section">
            <div className="info-title">Описание задачи</div>
            <div className="description-text">{task.description || 'Описание отсутствует'}</div>
          </div>

          <div className="contacts-block">
            <div className="contacts-title">
              <span>📞</span> Контакты заказчика
            </div>
            <div className="contact-item">
              <div className="contact-info">
                <div className="contact-label">Телефон</div>
                <div className="contact-value">{contacts?.phone || 'Не указан'}</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-info">
                <div className="contact-label">Email</div>
                <div className="contact-value">
                  {contacts?.email ? (
                    <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                  ) : (
                    'Не указан'
                  )}
                </div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-info">
                <div className="contact-label">Telegram</div>
                <div className="contact-value">
                  {contacts?.telegram ? (
                    <a
                      href={`https://t.me/${contacts.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contacts.telegram}
                    </a>
                  ) : (
                    'Не указан'
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <button className="btn-apply" onClick={handleApply} disabled={isApplying}>
              {isApplying ? 'Отправка...' : 'Откликнуться'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailPage;
