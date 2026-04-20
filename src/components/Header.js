import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/components/_header.scss";

function Header() {
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
      </div>
    </header>
  );
}

export default Header;
