import React from 'react';

/**
 * Универсальный компонент кнопки
 * @param {Object} props
 * @param {string} props.variant - Тип кнопки: 'primary', 'outline', 'danger', 'success'
 * @param {string} props.size - Размер: 'sm', 'md', 'lg'
 * @param {function} props.onClick - Функция при клике
 * @param {string} props.children - Содержимое кнопки
 * @param {boolean} props.disabled - Отключена ли кнопка
 * @param {string} props.className - Дополнительные CSS классы
 */
function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  disabled = false,
  className = '',
  type = 'button',
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'outline':
        return 'btn-outline';
      case 'danger':
        return 'btn-danger';
      case 'success':
        return 'btn-success';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      default:
        return '';
    }
  };

  return (
    <button
      type={type}
      className={`${getVariantClass()} ${getSizeClass()} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
