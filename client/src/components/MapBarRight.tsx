// src/MapBarRight.tsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { MapContext } from "./MapContext";

interface IconButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
}

interface Feature {
  id: string;
  place_name: string;
  geometry: { coordinates: [number, number] };
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, title }) => (
  <button
    className="map-bar__button"
    onClick={() => {
      console.log(`Click "${title}"`);
      onClick?.();
    }}
    title={title}
    type="button"
  >
    {children}
  </button>
);

export function MapBarRight() {
  const map = useContext(MapContext);
  const API_KEY = "13uJDYePQAdds9bDUBti";

  // поиск + подсказки
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Feature[]>([]);
  const debounceRef = useRef<number>();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(
            searchTerm
          )}.json?key=${API_KEY}&autocomplete=true&limit=5`
        );
        const json = await res.json();
        setSuggestions(json.features || []);
      } catch (e) {
        console.error("Autocomplete error", e);
      }
    }, 300);
  }, [searchTerm]);

  const selectSuggestion = (f: Feature) => {
    setSearchTerm(f.place_name);
    setSuggestions([]);
    const [lon, lat] = f.geometry.coordinates;
    map?.flyTo({ center: [lon, lat], zoom: 12 });
  };

  // скрываем подсказки по клику вне
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // 2D/3D флаг
  const [is3D, setIs3D] = useState(false);

  // подписываемся на изменение pitch
  useEffect(() => {
    if (!map) return;
    const update3D = () => {
      const pitch = map.getPitch();
      console.log("pitch changed:", pitch);
      setIs3D(pitch > 0);
    };
    map.on("pitchend", update3D);
    // сразу инициализируем
    update3D();
    return () => {
      map.off("pitchend", update3D);
    };
  }, [map]);

  const toggle3D = () => {
    if (!map) return;
    const target = is3D ? 0 : 60;
    map.easeTo({ pitch: target, duration: 800 });
    // состояние обновится в update3D после окончания анимации
  };

  // переключатель стилей
  const styleOptions = ["basic-v2", "satellite"] as const;
  const [styleIdx, setStyleIdx] = useState(0);

  const toggleStyle = () => {
    if (!map) return;
    const next = (styleIdx + 1) % styleOptions.length;
    const name = styleOptions[next];
    map.setStyle(
      `https://api.maptiler.com/maps/${name}/style.json?key=${API_KEY}`
    );
    setStyleIdx(next);
  };

  return (
    <div className="map-bar-right">
      {/* Поиск */}
      <div className="map-bar__search" ref={searchContainerRef}>
        <button className="search-button" title="Поиск">
          🔍
        </button>
        <input
          className="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="город или координаты"
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions.length) {
              selectSuggestion(suggestions[0]);
            }
          }}
        />
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((f) => (
              <li key={f.id} onClick={() => selectSuggestion(f)}>
                {f.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Кнопки управления */}
      <div className="map-bar__center">
        <IconButton title="Приблизить" onClick={() => map?.zoomIn()}>
          ＋
        </IconButton>
        <IconButton title="Отдалить" onClick={() => map?.zoomOut()}>
          －
        </IconButton>
        <IconButton
          title="Сброс ориентации"
          onClick={() => map?.resetNorth()}
        >
          ⟳
        </IconButton>
        <IconButton
          title={is3D ? "Перейти в 2D" : "Перейти в 3D"}
          onClick={toggle3D}
        >
          {is3D ? "2D" : "3D"}
        </IconButton>
        <IconButton
          title={
            styleOptions[styleIdx] === "basic-v2" ? "Спутник" : "Базовый"
          }
          onClick={toggleStyle}
        >
          🗺️
        </IconButton>
      </div>

      {/* Placeholder под кнопки высот */}
      <div className="map-bar__bottom" />
    </div>
  );
}
