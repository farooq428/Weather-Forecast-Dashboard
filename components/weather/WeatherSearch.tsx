"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

interface WeatherSearchProps {
  initialCity?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export default function WeatherSearch({
  initialCity = "",
  onSearch,
  loading = false,
}: WeatherSearchProps) {
  const STORAGE_KEY = "weather:recent-searches";

  const [query, setQuery] = useState(initialCity);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  const buttonLabel = useMemo(() => (loading ? "Loading..." : "Search"), [loading]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      setLocationError(null);
      onSearch(trimmedQuery);
      saveRecent(trimmedQuery);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported on this browser.");
      return;
    }

    setLocationError(null);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(4));
        const longitude = Number(position.coords.longitude.toFixed(4));
        const formattedCoordinates = `${latitude},${longitude}`;

        setQuery(formattedCoordinates);
        onSearch(formattedCoordinates);
          saveRecent(formattedCoordinates);
      },
      () => {
        setLocationError("Location access was denied. Please enter a city or coordinates manually.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  function saveRecent(value: string) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const normalized = value.trim();
      if (!normalized) return;

      const dedup = [normalized, ...arr.filter((v) => v !== normalized)];
      const limited = dedup.slice(0, 5);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      setRecent(limited);
    } catch (e) {
      // ignore storage errors
    }
  }

  useEffect(() => {
    // Read localStorage after mount to avoid hydration mismatches.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];

      // Update state asynchronously to avoid synchronous setState-in-effect lint.
      setTimeout(() => {
        setRecent(arr || []);

        // If no initialCity provided, auto-search the last recent
        if (!initialCity && arr && arr.length > 0) {
          const last = arr[0];
          setQuery(last);
          onSearch(last);
        }
      }, 0);
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecentClick = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-lg shadow-slate-200/60 backdrop-blur-sm sm:flex-row">
        <label htmlFor="weather-search" className="sr-only">
          Search city or coordinates
        </label>

        <input
          id="weather-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="City name or latitude, longitude"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {buttonLabel}
        </button>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
        >
          Use my location
        </button>
      </div>

      {locationError ? (
        <p className="mt-2 text-sm text-red-500">{locationError}</p>
      ) : null}

      
    </form>
  );
}
