import React from 'react';
import { useNavigate } from 'react-router-dom';

function TaskCard({ task }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/site/task/${task.id}`);
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
    if (date.getFullYear() === 1970 && date.getMonth() === 0 && date.getDate() === 1) {
      return null;
    }
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    });
  };
  return (
    <div className="task-card">
      <div className="card-header">
        <div className="company-logo">{task.logo || ' '}</div>
        <div className="company-info">
          <div className="company-name">{task.title || 'Без названия'}</div>
          <div className="job-title">{task.specialization || 'Без специализации'}</div>
        </div>
        <div className="salary-badge">{formatBudget(task.budget)}</div>
      </div>

      <div className="card-body">
        {task.technologies && task.technologies.length > 0 && (
          <div className="tech-stack">
            {task.technologies.map((tech) => (
              <span className="tech-tag" key={tech.id}>
                {tech.name}
              </span>
            ))}
          </div>
        )}
        <div className="job-description">
          {task.description || task.desc || 'Описание отсутствует'}
        </div>
        {task.deadline && formatDeadline(task.deadline) ? (
          <div className="deadline-info">Дедлайн: {formatDeadline(task.deadline)}</div>
        ) : null}
      </div>

      <div className="card-footer">
        <button className="swipe-action" onClick={handleNavigate}>
          Подробнее
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
