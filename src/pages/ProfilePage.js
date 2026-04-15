import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailVerificationModal from '../components/EmailVerificationModal';
import { emailService } from '../services/emailService';
import { telegramService } from '../services/telegramService';
import { authService } from '../services/authService';
import { API_PROFILE } from '../services/ApiConsts';

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    telegram: '',
  });
  const [originalEmail, setOriginalEmail] = useState('');
  const [avatar] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [isTelegramLinking, setIsTelegramLinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_PROFILE}/profiles/me`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка загрузки профиля');
        }

        const profileData = await response.json();

        const data = {
          username: profileData.username || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
          telegram: profileData.telegramUsername || '',
        };

        setFormData(data);
        setOriginalEmail(data.email);

        localStorage.setItem('profileData', JSON.stringify(data));
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setError('Не удалось загрузить данные профиля');

        const savedData = localStorage.getItem('profileData');
        if (savedData) {
          const data = JSON.parse(savedData);
          setFormData({
            username: data.username || data.login || '',
            phone: data.phone || '',
            email: data.email || '',
            telegram: data.telegram || '',
          });
          setOriginalEmail(data.email || '');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleEmailVerify = () => {
    setFormData((prev) => ({ ...prev, email: pendingEmail }));
    setOriginalEmail(pendingEmail);
    setPendingEmail('');
    setIsEmailModalOpen(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (formData.email !== originalEmail && formData.email.trim() !== '') {
      setPendingEmail(formData.email);
      try {
        await emailService.sendConfirmationCode(formData.email);
        setIsEmailModalOpen(true);
      } catch (err) {
        alert('Ошибка отправки кода подтверждения: ' + err.message);
      }
    } else {
      performSave();
    }
  };

  const performSave = async () => {
    try {
      const dataToSave = {
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        telegram: formData.telegram,
      };
      localStorage.setItem('profileData', JSON.stringify(dataToSave));
      setOriginalEmail(formData.email || '');
      setIsEditing(false);
    } catch (err) {
      alert('Ошибка сохранения: ' + err.message);
    }
  };

  const handleCancel = () => {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setFormData({
        username: data.username || data.login || '',
        phone: data.phone || '',
        email: data.email || '',
        telegram: data.telegram || '',
      });
      setOriginalEmail(data.email || '');
    }
    setIsEditing(false);
    setPendingEmail('');
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const handleTelegramLink = async () => {
    setIsTelegramLinking(true);
    try {
      const response = await telegramService.getTelegramLink();
      if (response) {
        telegramService.openTelegramLink(response);
      } else if (response && response.url) {
        telegramService.openTelegramLink(response.url);
      } else {
        alert('Не удалось получить ссылку для привязки Telegram');
      }
    } catch (error) {
      alert('Ошибка привязки Telegram: ' + error.message);
    } finally {
      setIsTelegramLinking(false);
    }
  };

  const displayUsername = formData.username || 'Пользователь';
  const hasTelegram = formData.telegram && formData.telegram.trim() !== '';
  const telegramDisplay = hasTelegram ? `@${formData.telegram}` : 'не привязан';

  if (loading) {
    return (
      <div className="container profile-container">
        <div className="page-header">
          <div className="page-title">👤 Личный кабинет</div>
        </div>
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container profile-container">
      <div className="page-header">
        <div className="page-title">👤 Личный кабинет</div>
        <div className="page-subtitle">Управление профилем и настройками</div>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">{avatar ? <img src={avatar} alt="avatar" /> : '👤'}</div>
          <h2 className="profile-name">{displayUsername}</h2>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <div className="info-label">Имя пользователя</div>
            <div className="info-value">
              {isEditing ? (
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Введите имя пользователя"
                />
              ) : (
                <span>{formData.username || 'Не указано'}</span>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Номер телефона</div>
            <div className="info-value">
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                />
              ) : (
                <span>{formData.phone || 'Не указано'}</span>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Email</div>
            <div className="info-value">
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                />
              ) : (
                <span>{formData.email || 'Не указано'}</span>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Telegram</div>
            <div className="info-value telegram-value">
              {isEditing ? (
                <button
                  className="telegram-link-btn"
                  onClick={handleTelegramLink}
                  disabled={isTelegramLinking}
                >
                  {isTelegramLinking ? 'Загрузка...' : 'Привязать'}
                </button>
              ) : (
                <span className={hasTelegram ? 'telegram-linked' : 'telegram-not-linked'}>
                  {telegramDisplay}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <div className="action-buttons">
              <button className="btn-edit" onClick={handleEdit}>
                Изменить профиль
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Выйти из аккаунта
              </button>
            </div>
          ) : (
            <div className="action-buttons">
              <button className="btn-cancel" onClick={handleCancel}>
                Отмена
              </button>
              <button className="btn-save" onClick={handleSave}>
                Сохранить
              </button>
            </div>
          )}
        </div>
      </div>

      <EmailVerificationModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setPendingEmail('');
        }}
        onVerify={handleEmailVerify}
        email={pendingEmail}
      />
    </div>
  );
}

export default ProfilePage;
