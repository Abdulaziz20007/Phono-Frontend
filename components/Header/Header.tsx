"use client";

import React, { useState } from "react";
import "./Header.scss";
import Link from "next/link";
import { useUser } from "../../context/UserContext";

function Header() {
  const { user, isAuthenticated, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo">
          <Link href="/">Phono</Link>
        </div>
        <div className="header-actions">
          <Link href="/messages" className="header-action-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3334 14.1667C18.3334 14.6087 18.1578 15.0326 17.8453 15.3452C17.5327 15.6577 17.1088 15.8333 16.6667 15.8333H5.00008L1.66675 19.1667V4.16667C1.66675 3.72464 1.84234 3.30072 2.15491 2.98816C2.46747 2.67559 2.89139 2.5 3.33341 2.5H16.6667C17.1088 2.5 17.5327 2.67559 17.8453 2.98816C18.1578 3.30072 18.3334 3.72464 18.3334 4.16667V14.1667Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Сообщения</span>
          </Link>
          <Link href="/favorites" className="header-action-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 18.3333L8.5833 17.0533C3.5 12.5533 0 9.48 0 5.83333C0 2.76333 2.41667 0.333332 5.5 0.333332C7.24167 0.333332 8.91667 1.12333 10 2.41667C11.0833 1.12333 12.7583 0.333332 14.5 0.333332C17.5833 0.333332 20 2.76333 20 5.83333C20 9.48 16.5 12.5533 11.4167 17.0533L10 18.3333Z"
                fill="currentColor"
              />
            </svg>
            <span>Избранное</span>
          </Link>

          {isAuthenticated && user ? (
            <div className="user-profile">
              <div
                className="user-profile-button"
                onClick={toggleDropdown}
                role="button"
                tabIndex={0}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.name} ${user.surname}`}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.name.charAt(0)}
                    {user.surname.charAt(0)}
                  </div>
                )}
                <span className="user-name">
                  {user.name} {user.surname}
                </span>
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link href="/profile" className="dropdown-item">
                    Мой профиль
                  </Link>
                  <Link href="/settings" className="dropdown-item">
                    Настройки
                  </Link>
                  <div
                    onClick={handleLogout}
                    className="dropdown-item"
                    role="button"
                    tabIndex={0}
                  >
                    Выход
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="header-action-link">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0653 12.8512 14.2174 12.5 13.3334 12.5H6.66671C5.78265 12.5 4.93481 12.8512 4.30968 13.4763C3.68456 14.1014 3.33337 14.9493 3.33337 15.8333V17.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 9.16667C11.8411 9.16667 13.3334 7.67428 13.3334 5.83333C13.3334 3.99238 11.8411 2.5 10.0001 2.5C8.15913 2.5 6.66675 3.99238 6.66675 5.83333C6.66675 7.67428 8.15913 9.16667 10.0001 9.16667Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Авторизация</span>
            </Link>
          )}

          <Link href="/product/create" className="add-listing-button">
            Добавить объявление
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
