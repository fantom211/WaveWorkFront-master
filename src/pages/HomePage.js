import React from 'react';
import { useNavigate } from 'react-router-dom';
import { telegramService } from '../services/telegramService';

function HomePage() {
  const navigate = useNavigate();

  const handleTryClick = async () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
      navigate('/site/login');
    } else {
      try {
        const response = await telegramService.getTelegramLink();
        if (response && response.link) {
          telegramService.openTelegramLink(response.link);
        } else if (response && response.url) {
          telegramService.openTelegramLink(response.url);
        } else {
          alert('Не удалось получить ссылку для перехода в Telegram');
        }
      } catch (error) {
        alert('Ошибка: ' + error.message);
      }
    }
  };

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-text">
          <h1>
            Знакомства с работой
            <br />
            на новой скорости
          </h1>
          <p>
            WaveWork — сервис, где <strong>работники свайпают вакансии</strong>, а
            <strong>работодатели размещают предложения и получают заявки</strong>. Никаких
            бесконечных откликов в никуда — только осознанный выбор.
          </p>
          <div className="badge-list">
            <span className="badge">Свайп вправо → отклик</span>
            <span className="badge">Работодатель получает заявку</span>
            <span className="badge">Сокращаем поиск работы в 5 раз</span>
          </div>
        </div>
        <div className="hero-demo">
          <div className="swipe-preview">
            <div className="swipe-row">
              <div className="swipe-card-mini">
                <div className="swipe-icon"></div>
                <div>Соискатель</div>
                <div style={{ fontSize: '12px', marginTop: '6px' }}>свайп вправо → отклик</div>
              </div>
              <div className="swipe-card-mini">
                <div>Работодатель</div>
                <div style={{ fontSize: '12px', marginTop: '6px' }}>получает заявки</div>
              </div>
            </div>
            <div className="demo-swipe-badge" style={{ margin: '0 auto' }}>
              работник свайпает вакансии
            </div>
            <div className="demo-swipe-badge" style={{ margin: '4px auto 0' }}>
              работодатель публикует вакансии и выбирает среди откликнувшихся
            </div>
            <div className="note">
              После отклика работодатель видит вашу анкету и может пригласить в чат
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <h2 className="section-title">Как работает сервис</h2>
        <div className="steps">
          <div className="step-card">
            <h3>Для соискателя</h3>
            <p>
              Вы просматриваете карточки вакансий. Свайп вправо — вакансия заинтересовала, отклик
              отправлен. Свайп влево — пропуск. Работодатель получит ваш отклик и свяжется, если вы
              подходите.
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon"></div>
            <h3>Для работодателя</h3>
            <p>
              Размещайте вакансии с описанием требований и условий. Получайте отклики от
              заинтересованных соискателей, просматривайте анкеты и приглашайте лучших в чат.
            </p>
          </div>
          <div className="step-card">
            <h3>Быстрый контакт</h3>
            <p>
              Никакого спама — только те кандидаты, которые сами проявили интерес. После приглашения
              открывается чат для обсуждения деталей и собеседования.
            </p>
          </div>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-item">
          <h4>Для кого</h4>
          <p>
            IT, креативные индустрии, сервис, стартапы и любой бизнес, который ценит время. Идеально
            для соискателей, уставших от бесконечных рассылок, и компаний, ищущих активных
            кандидатов.
          </p>
        </div>
        <div className="feature-item">
          <h4>Умные фильтры</h4>
          <p>
            Настраивайте параметры поиска: зарплата, график, стек технологий, локация. Алгоритм
            показывает релевантные вакансии первыми.
          </p>
        </div>
        <div className="feature-item">
          <h4>Безопасность и модерация</h4>
          <p>
            Проверенные компании, верификация профилей, жалобы на нежелательный контент. Свайпайте с
            комфортом и уверенностью.
          </p>
        </div>
      </div>

      <hr />

      <div style={{ margin: '40px 0 20px', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #d9a7ff, #b87cff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Почему формат "свайп-найма" для работников?
        </h2>
        <p style={{ maxWidth: '720px', margin: '0 auto', color: '#cbc9f0' }}>
          Больше никаких скучных досок вакансий и рассылки сотен откликов. Просто свайпайте
          интересные предложения, а работодатели сами приглашают вас в диалог. Вы тратите минуты,
          чтобы найти работу мечты.
        </p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">78%</div>
          <div>соискателей быстрее находят работу</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">3.2x</div>
          <div>выше качество откликов для работодателей</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div>доступ к свайп-ленте с любого устройства</div>
        </div>
      </div>

      <div className="cta-block">
        <h3 className="cta-title">Готовы попробовать новый формат?</h3>
        <p
          style={{
            marginBottom: '28px',
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Создайте профиль за 5 минут и опробуйте поиск работы в IT по-новому уже сейчас
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleTryClick}>
            Опробовать
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
