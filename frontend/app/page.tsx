"use client";

import { useCallback, useState } from "react";

import WeatherPanel from "@/components/weather/WeatherPanel";
import WeatherSearch from "@/components/weather/WeatherSearch";
import type { WeatherApiResponse } from "@/types/weather";

const DEFAULT_QUERY = "";

export default function HomePage() {
  const [selectedQuery, setSelectedQuery] = useState(DEFAULT_QUERY);
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setWeather(null);
      setError("Please enter a valid city name or coordinates.");
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedQuery(trimmedQuery);

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(trimmedQuery)}`
      );

      const payload = (await response.json()) as WeatherApiResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to fetch weather data.");
      }

      setWeather(payload);
    } catch (fetchError) {
      setWeather(null);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch weather data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f1f9ff,#e2e8f0_40%,#dbeafe_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-sky-700">
            Weather Dashboard
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Check the weather anywhere
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Search by city name, coordinates, or use your live location.
          </p>
        </header>

        <div className="mb-8">
          <WeatherSearch
            initialCity={selectedQuery}
            onSearch={fetchWeather}
            loading={loading}
          />
        </div>

        <WeatherPanel data={weather} error={error} loading={loading} />
      </div>
    </main>
  );
}