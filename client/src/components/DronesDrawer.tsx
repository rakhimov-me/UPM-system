// src/components/DronesDrawer.tsx
import { useState, useEffect } from "react";
import { Drawer } from "./Drawer";

interface Drone {
  id: number;
  brand: string;
  model: string;
  serial_number: string;
}

export function DronesDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/drones")
      .then((r) => r.json())
      .then((data: Drone[]) => setDrones(data));
  }, [isOpen]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/drones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand, model, serial_number: serial, pilotId: 1 }),
    });
    if (res.ok) {
      setBrand("");
      setModel("");
      setSerial("");
      // перезагрузим список
      const updated = await fetch("/api/drones").then((r) => r.json());
      setDrones(updated);
    } else {
      alert("Ошибка добавления дрона");
    }
  };

  return (
    <Drawer title="Мои дроны" isOpen={isOpen} onClose={onClose}>
      {drones.length ? (
        <ul className="space-y-2">
          {drones.map((d) => (
            <li key={d.id} className="border p-2 rounded">
              <p>
                <strong>{d.brand} {d.model}</strong>
              </p>
              <p>Серийный номер: {d.serial_number}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>У вас пока нет зарегистрированных дронов.</p>
      )}

      <form onSubmit={handleAdd} className="mt-6 space-y-3">
        <h3 className="font-medium">Добавить дрон</h3>
        <input
          className="w-full border p-2"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Марка"
          required
        />
        <input
          className="w-full border p-2"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Модель"
          required
        />
        <input
          className="w-full border p-2"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="Серийный номер"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2">
          Добавить
        </button>
      </form>
    </Drawer>
  );
}
