import React from 'react';

/**
 * Компонент для отображения одного отклика соискателя
 * @param {Object} props
 * @param {Object} props.response - Данные отклика
 * @param {string} props.response.login - Логин соискателя
 * @param {string} [props.response.phone] - Телефон (опционально)
 * @param {string} [props.response.email] - Email (опционально)
 * @param {string} [props.response.telegram] - Telegram username (опционально)
 */
function ResponseItem({ response }) {
  const { login, phone, email, telegram } = response;

  const cleanTelegram = telegram?.startsWith('@') ? telegram.slice(1) : telegram;

  const contacts = [];

  if (phone && phone.trim() !== '') {
    contacts.push({
      type: 'phone',
      icon: ' ',
      value: phone,
      href: `tel:${phone}`,
      label: phone,
    });
  }

  if (email && email.trim() !== '') {
    contacts.push({
      type: 'email',
      icon: ' ',
      value: email,
      href: `mailto:${email}`,
      label: email,
    });
  }

  if (telegram && telegram.trim() !== '') {
    contacts.push({
      type: 'telegram',
      icon: ' ',
      value: telegram,
      href: `https://t.me/${cleanTelegram}`,
      label: telegram,
    });
  }

  return (
    <div className="response-item">
      <div className="response-name">👤 {login || 'Пользователь'}</div>

      {contacts.length > 0 ? (
        <div className="response-contacts">
          {contacts.map((contact, index) => (
            <div className="response-contact" key={index}>
              {contact.icon}{' '}
              <a href={contact.href} target="_blank" rel="noopener noreferrer">
                {contact.label}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="response-no-contacts">Нет доступных контактов</div>
      )}
    </div>
  );
}

export default ResponseItem;
