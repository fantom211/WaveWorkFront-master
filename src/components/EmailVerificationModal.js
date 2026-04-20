import React, { useState } from "react";
import { emailService } from '../services/emailService';
import "../styles/components/EmailVerificationModal.scss";

function EmailVerificationModal({ isOpen, onClose, onVerify, email }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      setError("Email не указан");
      return;
    }

    setIsSendingCode(true);
    setError("");

    try {
      await emailService.sendConfirmationCode(email);
      setError("");
    } catch (err) {
      setError(err.message || "Ошибка отправки кода. Попробуйте позже.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 4) {
      setError("Введите 4-значный код");
      return;
    }

    setIsLoading(true);

    try {
      if (code !== "1234") {
        throw new Error("Неверный код подтверждения");
      }

      onVerify();
      setCode("");
    } catch (err) {
      setError(err.message || "Неверный код подтверждения");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Подтверждение email</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>Введите код подтверждения, отправленный на адрес</p>
          <p className="modal-email">{email}</p>

          <form onSubmit={handleSubmit}>
            <div className="code-input-group">
              <input
                type="text"
                maxLength="4"
                placeholder="0000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && <div className="modal-error">{error}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-resend"
                onClick={handleSendCode}
                disabled={isLoading || isSendingCode}
              >
                {isSendingCode ? "Отправка..." : "Отправить код"}
              </button>
              <button
                type="submit"
                className="modal-verify"
                disabled={isLoading}
              >
                {isLoading ? "Проверка..." : "Подтвердить"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationModal;
