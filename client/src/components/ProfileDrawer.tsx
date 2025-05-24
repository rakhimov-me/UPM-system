// src/components/ProfileDrawer.tsx
import { useState, useEffect } from "react";
import { Drawer } from "./Drawer";

interface Pilot {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string;
  email?: string;
  phone?: string;
}

export function ProfileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/pilots")
      .then((r) => r.json())
      .then((list: Pilot[]) => {
        if (list.length) {
          setPilot(list[0]);
        }
      });
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/pilots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastName, firstName, middleName }),
    });
    if (res.ok) {
      const created = await res.json();
      setPilot(created);
    } else {
      alert("Ошибка регистрации");
    }
  };

  return (
    <Drawer title="Профиль" isOpen={isOpen} onClose={onClose}>
      {pilot ? (
        <div className="space-y-2">
          <p>
            <strong>ФИО:</strong>{" "}
            {pilot.last_name} {pilot.first_name} {pilot.middle_name}
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
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p>Заполните свои данные:</p>
          <input
            className="w-full border p-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Фамилия"
            required
          />
          <input
            className="w-full border p-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Имя"
            required
          />
          <input
            className="w-full border p-2"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="Отчество"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2">
            Сохранить
          </button>
        </form>
      )}
    </Drawer>
  );
}
