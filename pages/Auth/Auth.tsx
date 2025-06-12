"use client";

import React, { useState, useEffect } from "react";
import "./Auth.scss";
import { api } from "../../api/api";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";

function Auth() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useUser();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [verificationStep, setVerificationStep] = useState("auth"); // "auth", "verification"
  const [authMode, setAuthMode] = useState("register"); // "login", "register"
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [timer, setTimer] = useState(0);
  const [expireTime, setExpireTime] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uuid, setUuid] = useState("");

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Update timer based on expire time
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (expireTime) {
      const updateTimer = () => {
        const now = new Date();
        const expireDate = new Date(expireTime);
        const diffInSeconds = Math.floor(
          (expireDate.getTime() - now.getTime()) / 1000
        );

        if (diffInSeconds <= 0) {
          clearInterval(interval);
          setTimer(0);
          toast.error("Время ввода кода истекло");
        } else {
          setTimer(diffInSeconds);
        }
      };

      // Initial update
      updateTimer();

      // Update every second
      interval = setInterval(updateTimer, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [expireTime]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 9 digits
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) {
      setPhoneNumber(value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(e.target.value);
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.auth.register({
        phone: phoneNumber,
        password,
        name,
        surname,
      });

      setUuid(response.uuid);
      setExpireTime(response.expire);
      setVerificationStep("verification");

      toast.success("Код подтверждения отправлен на ваш номер");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка регистрации";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.auth.login({
        phone: phoneNumber,
        password,
      });

      // Use the login function from UserContext
      await login(response.accessToken);

      // Redirect to home page or dashboard
      router.push("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка входа";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...verificationCode];

    if (value.length > 0) {
      newCode[index] = value.slice(-1);

      if (index < 5 && value) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    } else {
      newCode[index] = "";
    }

    setVerificationCode(newCode);
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setError("");

      const code = verificationCode.join("");

      if (timer <= 0) {
        toast.error(
          "Время ввода кода истекло. Пожалуйста, запросите новый код."
        );
        setVerificationStep("auth");
        return;
      }

      const response = await api.auth.verifyOTP({
        otp: code,
        uuid,
        phone: phoneNumber,
        expire: expireTime,
      });

      toast.success("Регистрация успешно завершена!");

      // Use the login function from UserContext
      await login(response.accessToken);

      // Redirect to home page or dashboard
      router.push("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка проверки кода";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
    setError("");
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {verificationStep === "auth" ? (
          <>
            <h1>{authMode === "register" ? "Регистрация" : "Вход"}</h1>
            <p className="auth-description">
              {authMode === "register"
                ? "На ваш номер будет отправлен смс код для подтверждения регистрации"
                : "Введите данные для входа в систему"}
            </p>

            <div className="phone-input-container">
              <div className="phone-prefix">+998</div>
              <input
                type="text"
                placeholder="Номер телефона"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="phone-input"
                maxLength={9}
              />
            </div>

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={handlePasswordChange}
              className="form-input"
            />

            {authMode === "register" && (
              <>
                <input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={handleNameChange}
                  className="form-input"
                />

                <input
                  type="text"
                  placeholder="Фамилия"
                  value={surname}
                  onChange={handleSurnameChange}
                  className="form-input"
                />
              </>
            )}

            {error && <p className="error-message">{error}</p>}

            {authMode === "register" && (
              <p className="terms-text">
                Нажимая кнопку вы соглашаетесь с{" "}
                <a href="/terms" className="terms-link">
                  публичной офертой
                </a>
              </p>
            )}

            <button
              onClick={authMode === "register" ? handleRegister : handleLogin}
              className="submit-button"
              disabled={
                loading ||
                phoneNumber.length < 9 ||
                password.length < 6 ||
                (authMode === "register" && (!name || !surname))
              }
            >
              {loading
                ? "Загрузка..."
                : authMode === "register"
                ? "Зарегистрироваться"
                : "Войти"}
            </button>

            <p className="auth-switch">
              {authMode === "register"
                ? "Уже есть аккаунт? "
                : "Нет аккаунта? "}
              <a onClick={switchAuthMode} className="auth-switch-link">
                {authMode === "register" ? "Войти" : "Зарегистрироваться"}
              </a>
            </p>
          </>
        ) : (
          <>
            <h1>Код подтверждения</h1>
            <p className="auth-description">
              На ваш номер +998{phoneNumber} был отправлен SMS код для
              подтверждения регистрации
            </p>
            <div className="code-inputs">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="code-input"
                  disabled={timer <= 0}
                />
              ))}
            </div>
            <div className="timer">
              {timer > 0 ? formatTimer() : "Время истекло"}
            </div>

            {error && <p className="error-message">{error}</p>}

            <button
              onClick={handleVerifyCode}
              className="submit-button"
              disabled={
                loading ||
                verificationCode.some((digit) => !digit) ||
                timer <= 0
              }
            >
              {loading ? "Проверка..." : "Подтвердить"}
            </button>

            {timer <= 0 && (
              <button
                onClick={() => setVerificationStep("auth")}
                className="secondary-button"
              >
                Запросить новый код
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Auth;
