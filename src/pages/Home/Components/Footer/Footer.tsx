import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>Phono</h2>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h3>Мобильное приложение</h3>
            <ul>
              <li>
                <a href="#download">Условия использования</a>
              </li>
              <li>
                <a href="#privacy">Правила конфиденциальности</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Помощь</h3>
            <ul>
              <li>
                <a href="#terms">Платные услуги</a>
              </li>
              <li>
                <a href="#partners">Партнеры</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Навигация</h3>
            <ul>
              <li>
                <a href="#map">Карта сайта</a>
              </li>
              <li>
                <a href="#regions">Карта регионов</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Для бизнеса</h3>
            <ul>
              <li>
                <a href="#business">Как продавать в iPhone</a>
              </li>
            </ul>
            <div className="app-download">
              <a href="#appstore" className="download-button">
                App Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
