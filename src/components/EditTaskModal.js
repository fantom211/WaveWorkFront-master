import React, { useState, useEffect } from 'react';
import '../styles/components/EditTaskModal.scss';

function EditTaskModal({ isOpen, onClose, onEdit, task }) {
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

  const formatTechnologiesToString = (technologies) => {
    if (!technologies || technologies.length === 0) return '';

    if (technologies[0]?.name) {
      return technologies.map((tech) => tech.name).join(', ');
    }

    if (typeof technologies[0] === 'string') {
      return technologies.join(', ');
    }

    return '';
  };

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || task.desc || '',
        budget: task.budget?.toString() ?? '',
        specialization: task.specialization || '',
        technologies: formatTechnologiesToString(task.technologies || task.tech),
        deadline: task.deadline ? task.deadline.slice(0, 16) : '',
      });
    }
  }, [task]);

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

  const handleSubmit = (e) => {
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

    const updatedTask = {
      ...task,
      title: formData.title,
      description: formData.description,
      budget: parseFloat(formData.budget),
      category: 'null',
      specialization: formData.specialization,
      technologies: technologiesArray,
      deadline: formData.deadline || null,
    };

    onEdit(updatedTask);
    onClose();
  };

  const handleClose = () => {
    resetForm();
    setIsLoading(false);
    setError('');
    onClose();
  };

  const resetForm = () => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || task.desc || '',
        budget: task.budget?.toString() ?? '',
        specialization: task.specialization || '',
        technologies: formatTechnologiesToString(task.technologies || task.tech),
        deadline: task.deadline ? task.deadline.slice(0, 16) : '',
      });
    }
    setError('');
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="edit-task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Редактировать задачу</h3>
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
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
