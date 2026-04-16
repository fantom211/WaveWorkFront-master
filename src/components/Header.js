import React from 'react';
import { NavLink } from 'react-router-dom';

const USER_UUIDS = {
  user1: '123e4567-e89b-12d3-a456-426614174000',
  user2: '223e4567-e89b-12d3-a456-426614174001',
  user3: '323e4567-e89b-12d3-a456-426614174002',
};

function Header() {
  function Header() {
    const [currentUUID, setCurrentUUID] = useState(() => {
      const savedUUID = localStorage.getItem('userUUID');
      if (savedUUID && Object.values(USER_UUIDS).includes(savedUUID)) {
        return savedUUID;
      }
      return USER_UUIDS.user1;
    });

    const switchUser = () => {
      const users = Object.values(USER_UUIDS);
      const currentIndex = users.indexOf(currentUUID);
      const nextIndex = (currentIndex + 1) % users.length;
      const newUUID = users[nextIndex];

      setCurrentUUID(newUUID);

      localStorage.setItem('userUUID', newUUID);

      window.dispatchEvent(new CustomEvent('userChanged', { detail: { uuid: newUUID } }));

      console.log(`User switched to UUID: ${newUUID}`);
    };

    useEffect(() => {
      const handleStorageChange = (e) => {
        if (e.key === 'userUUID' && e.newValue) {
          setCurrentUUID(e.newValue);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const getCurrentUserName = () => {
      switch (currentUUID) {
        case USER_UUIDS.user1:
          return 'Пользователь 1';
        case USER_UUIDS.user2:
          return 'Пользователь 2';
        case USER_UUIDS.user3:
          return 'Пользователь 3';
        default:
          return 'Неизвестный';
      }
    };

    return (
      <header className="main-header">
        <div className="container header-inner">
          <div className="nav-left">
            <NavLink to="/site/HomePage" className="logo">
              🌊 WaveWork
            </NavLink>
            <NavLink
              to="/site/HomePage"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Главная
            </NavLink>
            <NavLink
              to="/site/tasks"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Задачи
            </NavLink>
            <NavLink
              to="/site/replies"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Мои задачи
            </NavLink>
            <NavLink
              to="/site/profile"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Профиль
            </NavLink>
          </div>

          <div className="user-switch-container">
            <div className="current-user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{getCurrentUserName()}</span>
            </div>
            <button onClick={switchUser} className="btn-switch-user" title="Сменить пользователя">
              Сменить пользователя
            </button>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
