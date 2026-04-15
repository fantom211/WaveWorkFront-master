import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>WaveWork</h4>
            <p>Сервис быстрого найма</p>
            <p>Свайпай. Откликайся. Работай.</p>
          </div>
          <div className="footer-col">
            <h4>О сервисе</h4>
            <a href="#">О компании</a>
            <a href="#">Блог</a>
            <a href="#">Вакансии в WaveWork</a>
            <a href="#">Партнёрам</a>
          </div>
          <div className="footer-col">
            <h4>Помощь</h4>
            <a href="#">Центр поддержки</a>
            <a href="#">Правила платформы</a>
            <a href="#">Безопасность</a>
            <a href="#">Связаться с нами</a>
          </div>
          <div className="footer-col">
            <h4>Контакты</h4>
            <p>+7 (999) 888-77-66</p>
            <p>contact@wavework.ru</p>
            <p>Калининград, ул. Пушкина, 228</p>
            <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
              <span>TG</span>
              <span>VK</span>
            </div>
          </div>
        </div>
        <div className="copyright">
          <span>© {currentYear} WaveWork. Все права защищены.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
