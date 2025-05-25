import { useState, useEffect } from "react";
import { Drawer } from "./Drawer";
import { registerPilot, loginPilot, getProfile } from "../api/auth";

interface Pilot {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string;
  email?: string;
  phone?: string;
}

type View = "login" | "register" | "profile";

export function ProfileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [view, setView] = useState<View>("login");

  // Registration fields
  const [regLast, setRegLast] = useState("");
  const [regFirst, setRegFirst] = useState("");
  const [regMiddle, setRegMiddle] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Login fields
  const [loginId, setLoginId] = useState(""); // email or phone
  const [loginPassword, setLoginPassword] = useState("");

  // ------------------------------------------------------------------
  // Helpers
  const loadProfile = async () => {
    try {
      const user: Pilot = await getProfile();
      setPilot(user);
      setView("profile");
    } catch {
      localStorage.removeItem("token");
      setPilot(null);
      setView("login");
    }
  };

  // Load profile if drawer opens and есть token
  useEffect(() => {
    if (!isOpen) return;
    if (localStorage.getItem("token")) {
      loadProfile();
    } else {
      setView("login");
      setPilot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ------------------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    setPilot(null);
    setView("login");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await registerPilot({
        lastName: regLast,
        firstName: regFirst,
        middleName: regMiddle,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });
      localStorage.setItem("token", token);
      await loadProfile();
    } catch {
      alert("Ошибка регистрации");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await loginPilot(loginId, loginPassword);
      localStorage.setItem("token", token);
      await loadProfile();
    } catch {
      alert("Ошибка входа");
    }
  };

  // ------------------------------------------------------------------
  return (
    <Drawer title="Профиль" isOpen={isOpen} onClose={onClose}>
      {view === "profile" && pilot && (
        <div className="space-y-4">
          <p>
            <strong>ФИО:</strong> {pilot.last_name} {pilot.first_name}{" "}
            {pilot.middle_name || ""}
          </p>
          {pilot.email && (
            <p>
              <strong>Email:</strong> {pilot.email}
            </p>
          )}
          {pilot.phone && (
            <p>
              <strong>Телефон:</strong> {pilot.phone}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded"
          >
            Выйти
          </button>
        </div>
      )}

      {view === "login" && !pilot && (
        <form onSubmit={handleLogin} className="space-y-4">
          <p>Вход в систему</p>
          <input
            className="w-full border p-2"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="Email или телефон"
            required
          />
          <input
            type="password"
            className="w-full border p-2"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Войти
          </button>
          <p className="text-sm text-center">
            Нет аккаунта?{" "}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => setView("register")}
            >
              Регистрация
            </button>
          </p>
        </form>
      )}

      {view === "register" && !pilot && (
        <form onSubmit={handleRegister} className="space-y-4">
          <p>Регистрация</p>
          <input
            className="w-full border p-2"
            value={regLast}
            onChange={(e) => setRegLast(e.target.value)}
            placeholder="Фамилия"
            required
          />
          <input
            className="w-full border p-2"
            value={regFirst}
            onChange={(e) => setRegFirst(e.target.value)}
            placeholder="Имя"
            required
          />
          <input
            className="w-full border p-2"
            value={regMiddle}
            onChange={(e) => setRegMiddle(e.target.value)}
            placeholder="Отчество"
          />
          <input
            className="w-full border p-2"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="w-full border p-2"
            value={regPhone}
            onChange={(e) => setRegPhone(e.target.value)}
            placeholder="Телефон"
            type="tel"
            required
          />
          <input
            type="password"
            className="w-full border p-2"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Зарегистрироваться
          </button>
          <p className="text-sm text-center">
            Уже есть аккаунт?{" "}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => setView("login")}
            >
              Войти
            </button>
          </p>
        </form>
      )}
    </Drawer>
  );
}
