import React, { useState } from 'react';
import '../styles/components/AddTaskModal.scss';

function AddTaskModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    specialization: '',
    technologies: '',
    deadline: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (error) setError('');
  };

  const validateBudget = (budget) => {
    const cleanedBudget = budget.replace(/\s/g, '');
    const numberRegex = /^\d+(\.\d{1,2})?$/;
    return numberRegex.test(cleanedBudget);
  };

  const validateDeadline = (deadline) => {
    if (!deadline) return true;
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    return dateRegex.test(deadline);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Введите название задачи');
      return;
    }
    if (!formData.description.trim()) {
      setError('Введите описание задачи');
      return;
    }
    if (!formData.budget.trim()) {
      setError('Введите бюджет');
      return;
    }
    if (!validateBudget(formData.budget)) {
      setError('Бюджет должен быть числом (до 2 знаков после запятой)');
      return;
    }
    if (!formData.specialization.trim()) {
      setError('Введите специализацию');
      return;
    }
    if (formData.deadline && !validateDeadline(formData.deadline)) {
      setError('Формат даты: ГГГГ-ММ-ДДTЧЧ:ММ (например, 2024-12-31T23:59)');
      return;
    }

    const technologiesArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    if (technologiesArray.length === 0) {
      setError('Добавьте хотя бы одну технологию');
      return;
    }

    setIsLoading(true);

    const taskData = {
      title: formData.title,
      description: formData.description,
      budget: parseFloat(formData.budget),
      category: 'null',
      specialization: formData.specialization,
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t),
      deadline: formData.deadline || null,
    };

    try {
      await onAdd(taskData);
      handleClose();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      budget: '',
      specialization: '',
      technologies: '',
      deadline: '',
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>➕ Добавить новую задачу</h3>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="title">Название задачи *</label>
              <input
                type="text"
                id="title"
                placeholder="Например: Создать сайт"
                value={formData.title}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание задачи *</label>
              <textarea
                id="description"
                className="description-textarea"
                rows="4"
                placeholder="Опишите задачу, требования и условия..."
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget">Бюджет (₽) *</label>
              <input
                type="text"
                id="budget"
                placeholder="Например: 15000"
                value={formData.budget}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Специализация *</label>
              <input
                type="text"
                id="specialization"
                placeholder="Например: Frontend Developer, UI/UX Designer"
                value={formData.specialization}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Стек технологий (через запятую)</label>
              <input
                type="text"
                id="technologies"
                placeholder="Например: React, TypeScript, SCSS"
                value={formData.technologies}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">Дедлайн (UTC)</label>
              <input
                type="datetime-local"
                id="deadline"
                value={formData.deadline}
                onChange={handleChange}
                disabled={isLoading}
              />
              <small
                style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}
              >
                Время указывается в UTC. Пример: 2024-12-31 23:59
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-cancel"
              onClick={handleClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button type="submit" className="modal-submit" disabled={isLoading}>
              {isLoading ? 'Добавление...' : '➕ Добавить задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
