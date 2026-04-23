import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerificationModal from "../components/EmailVerificationModal";
import { telegramService } from "../services/telegramService";
import { authService } from "../services/authService";
import { taskService } from "../services/taskService";
import { proposalService } from "../services/proposalService";
import { API_BASE_URL } from "../services/ApiConsts";

const parseStackToArray = (stackValue) => {
  if (Array.isArray(stackValue)) {
    return stackValue
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof stackValue === "string") {
    return stackValue
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
};

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    telegram: "",
    stack: [],
  });
  const [originalEmail, setOriginalEmail] = useState("");
  const [avatar] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [isTelegramLinking, setIsTelegramLinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [approvedTasksLoading, setApprovedTasksLoading] = useState(false);
  const [expandedApprovedTasks, setExpandedApprovedTasks] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE_URL}/profile/profiles/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки профиля");
        }

        const profileData = await response.json();

        const data = {
          username: profileData.username || "",
          phone: profileData.phone || "",
          email: profileData.email || "",
          telegram: profileData.telegramUsername || "",
          stack: parseStackToArray(profileData.stack),
        };

        setFormData(data);
        setStackInput((data.stack || []).join(", "));
        setOriginalEmail(data.email);

        localStorage.setItem("profileData", JSON.stringify(data));
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
        setError("Не удалось загрузить данные профиля");

        const savedData = localStorage.getItem("profileData");
        if (savedData) {
          const data = JSON.parse(savedData);
          setFormData({
            username: data.username || data.login || "",
            phone: data.phone || "",
            email: data.email || "",
            telegram: data.telegram || "",
            stack: parseStackToArray(data.stack),
          });
          setStackInput(parseStackToArray(data.stack).join(", "));
          setOriginalEmail(data.email || "");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const loadApprovedTasks = async () => {
      try {
        setApprovedTasksLoading(true);
        const proposalsResponse = await proposalService.getUserProposals(
          1,
          100,
        );
        const proposals = proposalsResponse?.data ?? [];

        if (!Array.isArray(proposals) || proposals.length === 0) {
          setApprovedTasks([]);
          return;
        }

        const acceptedProposals = proposals.filter(
          (proposal) => String(proposal?.status || "").toLowerCase() === "accepted",
        );

        if (acceptedProposals.length === 0) {
          setApprovedTasks([]);
          return;
        }

        const approvedTasksList = await Promise.all(
          acceptedProposals.map(async (proposal) => {
            try {
              const taskId =
                proposal?.taskId ||
                proposal?.taskID ||
                proposal?.taskUuid;

              if (!taskId) return null;

              const taskResponse = await taskService.getTaskById(taskId);
              const task = taskResponse?.data || taskResponse;
              return task?.id ? task : null;
            } catch {
              return null;
            }
          }),
        );

        const uniqueTasks = approvedTasksList
          .filter(Boolean)
          .filter(
            (task, index, arr) =>
              arr.findIndex((item) => item.id === task.id) === index,
          );

        setApprovedTasks(uniqueTasks);
      } finally {
        setApprovedTasksLoading(false);
      }
    };

    loadApprovedTasks();
  }, []);

  const toggleApprovedTaskDescription = (taskId) => {
    setExpandedApprovedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "stack") {
      setStackInput(value);
      setFormData((prev) => ({
        ...prev,
        stack: parseStackToArray(value),
      }));
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleEmailVerify = async () => {
    const verifiedData = { ...formData, email: pendingEmail };
    setFormData(verifiedData);
    setOriginalEmail(pendingEmail);
    setPendingEmail("");
    setIsEmailModalOpen(false);
    await performSave(verifiedData);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (formData.email !== originalEmail && formData.email.trim() !== "") {
      setPendingEmail(formData.email);
      try {
        await emailService.sendConfirmationCode(formData.email);
        setIsEmailModalOpen(true);
      } catch (err) {
        alert("Ошибка отправки кода подтверждения: " + err.message);
      }
    } else {
      await performSave();
    }
  };

  const performSave = async (dataOverride) => {
    try {
      const data = dataOverride || formData;
      const dataToSave = {
        username: data.username,
        phone: data.phone,
        email: data.email,
        telegram: data.telegram,
        stack: parseStackToArray(data.stack),
      };

      const response = await fetch(`${API_BASE_URL}/profile/profiles/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Ошибка обновления профиля");
      }

      localStorage.setItem("profileData", JSON.stringify(dataToSave));
      setStackInput(dataToSave.stack.join(", "));
      setOriginalEmail(data.email || "");
      setIsEditing(false);
    } catch (err) {
      alert("Ошибка сохранения: " + err.message);
    }
  };

  const handleCancel = () => {
    const savedData = localStorage.getItem("profileData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setFormData({
        username: data.username || data.login || "",
        phone: data.phone || "",
        email: data.email || "",
        telegram: data.telegram || "",
        stack: parseStackToArray(data.stack),
      });
      setStackInput(parseStackToArray(data.stack).join(", "));
      setOriginalEmail(data.email || "");
    }
    setIsEditing(false);
    setPendingEmail("");
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate("/");
  };

  const handleTelegramLink = async () => {
    setIsTelegramLinking(true);
    try {
      const response = await telegramService.getTelegramLink();
      if (response) {
        telegramService.openTelegramLink(response);
      } else if (response && response.url) {
        telegramService.openTelegramLink(response.url);
      } else {
        alert("Не удалось получить ссылку для привязки Telegram");
      }
    } catch (error) {
      alert("Ошибка привязки Telegram: " + error.message);
    } finally {
      setIsTelegramLinking(false);
    }
  };

  const displayUsername = formData.username || "Пользователь";
  const hasTelegram = formData.telegram && formData.telegram.trim() !== "";
  const telegramDisplay = hasTelegram ? `@${formData.telegram}` : "не привязан";
  const stackDisplay =
    formData.stack.length > 0 ? formData.stack.join(", ") : "Не указано";

  if (loading) {
    return (
      <div className="container profile-container">
        <div className="page-header">
          <div className="page-title">👤 Личный кабинет</div>
        </div>
        <div className="profile-card">
          <div style={{ textAlign: "center", padding: "50px" }}>
            Загрузка профиля...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container profile-container">
      <div className="page-header">
        <div className="page-title">👤 Личный кабинет</div>
        <div className="page-subtitle">Управление профилем и настройками</div>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {avatar ? <img src={avatar} alt="avatar" /> : "👤"}
          </div>
          <h2 className="profile-name">{displayUsername}</h2>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <div className="info-label">Имя пользователя</div>
            <div className="info-value">
              {isEditing ? (
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Введите имя пользователя"
                />
              ) : (
                <span>{formData.username || "Не указано"}</span>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Номер телефона</div>
            <div className="info-value">
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                />
              ) : (
                <span>{formData.phone || "Не указано"}</span>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Email</div>
            <div className="info-value">
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                />
              ) : (
                <span>{formData.email || "Не указано"}</span>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Telegram</div>
            <div className="info-value telegram-value">
              {isEditing ? (
                <button
                  className="telegram-link-btn"
                  onClick={handleTelegramLink}
                  disabled={isTelegramLinking}
                >
                  {isTelegramLinking ? "Загрузка..." : "Привязать"}
                </button>
              ) : (
                <span
                  className={
                    hasTelegram ? "telegram-linked" : "telegram-not-linked"
                  }
                >
                  {telegramDisplay}
                </span>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Stack</div>
            <div className="info-value">
              {isEditing ? (
                <input
                  type="text"
                  id="stack"
                  value={stackInput}
                  onChange={handleChange}
                  placeholder="React, Node.js, C#"
                />
              ) : (
                <span>{stackDisplay}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <div className="action-buttons">
              <button className="btn-edit" onClick={handleEdit}>
                Изменить профиль
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Выйти из аккаунта
              </button>
            </div>
          ) : (
            <div className="action-buttons">
              <button className="btn-cancel" onClick={handleCancel}>
                Отмена
              </button>
              <button className="btn-save" onClick={handleSave}>
                Сохранить
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-card" style={{ marginTop: "20px" }}>
        <div className="profile-info">
          <div className="info-row">
            <div className="info-label">Одобренные работы</div>
            <div className="info-value">
              {approvedTasksLoading ? (
                <span>Загрузка...</span>
              ) : approvedTasks.length > 0 ? (
                <div className="vacancies-grid">
                  {approvedTasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="card-header">
                        <div className="company-logo">{task.logo || " "}</div>
                        <div className="company-info">
                          <div className="company-name">
                            {task.title || "Без названия"}
                          </div>
                          <div className="job-title">
                            {task.specialization || "Без специализации"}
                          </div>
                        </div>
                        <div className="salary-badge">
                          {task.budget
                            ? `${task.budget} ₽`
                            : "Бюджет не указан"}
                        </div>
                      </div>

                      <div className="card-body">
                        {task.technologies && task.technologies.length > 0 ? (
                          <div className="tech-stack">
                            {task.technologies.map((tech, index) => (
                              <span
                                className="tech-tag"
                                key={tech?.id || index}
                              >
                                {tech?.name || tech}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {expandedApprovedTasks[task.id] ? (
                          <div className="job-description">
                            {task.description || "Описание отсутствует"}
                          </div>
                        ) : null}
                      </div>

                      <div className="card-footer">
                        <button
                          className="swipe-action"
                          onClick={() => toggleApprovedTaskDescription(task.id)}
                        >
                          {expandedApprovedTasks[task.id]
                            ? "Скрыть описание"
                            : "Показать описание"}
                        </button>
                        <button
                          className="swipe-action"
                          onClick={() => {
                            // Заглушка до реализации завершения задачи.
                            alert("Функция завершения скоро будет доступна");
                          }}
                          style={{ marginLeft: "8px" }}
                        >
                          Завершить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span>Пока нет одобренных работ</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setPendingEmail("");
        }}
        onVerify={handleEmailVerify}
        email={pendingEmail}
      />
    </div>
  );
}

export default ProfilePage;
