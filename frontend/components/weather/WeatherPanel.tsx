import Image from "next/image";

import HourlyForecastChart from "@/components/weather/HourlyForecastChart";
import type { WeatherApiResponse } from "@/types/weather";

interface WeatherPanelProps {
  data: WeatherApiResponse | null;
  error: string | null;
  loading: boolean;
}

export default function WeatherPanel({ data, error, loading }: WeatherPanelProps) {
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/60">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
        <p className="text-lg font-medium text-slate-600">Loading weather information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-red-100 bg-red-50 p-8 text-center shadow-lg shadow-red-100/60">
        <p className="mb-3 text-4xl">⚠️</p>
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-xl shadow-slate-200/60 backdrop-blur-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-3xl">
          ☀️
        </div>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Search your city or use your location
        </h2>
        <p className="mt-3 text-base text-slate-600">
          Enter a city name, latitude and longitude, or click “Use my location” to get the latest weather.
        </p>
      </div>
    );
  }

  const { location, current, forecast } = data;
  const weatherIcon = current.condition.icon.startsWith("//")
    ? `https:${current.condition.icon}`
    : current.condition.icon;

  const nextThreeDays = forecast.forecastday.slice(0, 3);
  const hourlyForecast = forecast.forecastday.flatMap((day) => day.hour).slice(0, 24);
  const maxRainChance = Math.max(...hourlyForecast.map((hour) => hour.chance_of_rain), 0);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="bg-linear-to-r from-sky-600 via-cyan-500 to-blue-600 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">
                Current Weather
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{location.name}</h2>
              <p className="mt-2 text-sm text-sky-100 sm:text-base">
                {location.region}, {location.country}
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              {weatherIcon ? (
                <Image
                  src={weatherIcon}
                  alt={current.condition.text}
                  width={72}
                  height={72}
                  unoptimized
                />
              ) : null}
              <div>
                <p className="text-lg font-semibold">{current.condition.text}</p>
                <p className="text-sm text-sky-100">Feels like {Math.round(current.feelslike_c)}°C</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.8fr] lg:p-8">
          <div className="rounded-[24px] bg-slate-50 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-6xl font-black tracking-tight text-slate-900">
                  {Math.round(current.temp_c)}°C
                </p>
                <p className="mt-2 text-lg text-slate-500">{Math.round(current.temp_f)}°F</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm text-slate-500">Condition</p>
                <p className="text-lg font-semibold text-slate-800">{current.condition.text}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Humidity" value={`${current.humidity}%`} accent="bg-sky-50 text-sky-700" />
              <MetricCard label="Wind" value={`${current.wind_mph} mph`} accent="bg-amber-50 text-amber-700" />
              <MetricCard label="Rain" value={`${current.precip_mm} mm`} accent="bg-blue-50 text-blue-700" />
              <MetricCard label="Feels Like" value={`${Math.round(current.feelslike_f)}°F`} accent="bg-violet-50 text-violet-700" />
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] bg-slate-900 p-5 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Insights</p>
              <h3 className="mt-2 text-2xl font-bold">Today</h3>
            </div>

            <InsightItem label="Humidity" value={`${current.humidity}%`} tone="sky" />
            <InsightItem label="Wind" value={`${current.wind_mph} mph`} tone="amber" />
            <InsightItem label="Rain risk" value={`${maxRainChance}%`} tone="blue" />
            <InsightItem label="Feels like" value={`${Math.round(current.feelslike_c)}°C`} tone="violet" />
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Analytics</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Hourly Weather Forecast</h3>
          </div>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
            Next 24 hours
          </span>
        </div>

        <HourlyForecastChart data={hourlyForecast} />
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Forecast</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Next 3 Days</h3>
          </div>
          <span className="text-sm font-medium text-slate-500">Rain chance & precipitation</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {nextThreeDays.map((day) => {
            const forecastIcon = day.day.condition.icon.startsWith("//")
              ? `https:${day.day.condition.icon}`
              : day.day.condition.icon;

            const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            return (
              <div key={day.date} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-base font-semibold text-slate-800">{formattedDate}</p>
                  {forecastIcon ? (
                    <Image
                      src={forecastIcon}
                      alt={day.day.condition.text}
                      width={38}
                      height={38}
                      unoptimized
                    />
                  ) : null}
                </div>

                <p className="mb-3 text-sm text-slate-600">{day.day.condition.text}</p>

                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>High</span>
                    <strong>{Math.round(day.day.maxtemp_c)}°C</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Low</span>
                    <strong>{Math.round(day.day.mintemp_c)}°C</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rain chance</span>
                    <strong>{day.day.daily_chance_of_rain}%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rain total</span>
                    <strong>{day.day.totalprecip_mm} mm</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-lg font-bold ${accent}`}>
        {value}
      </p>
    </div>
  );
}

function InsightItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "sky" | "amber" | "blue" | "violet";
}) {
  const classes = {
    sky: "bg-sky-500/10 text-sky-200",
    amber: "bg-amber-500/10 text-amber-200",
    blue: "bg-blue-500/10 text-blue-200",
    violet: "bg-violet-500/10 text-violet-200",
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`rounded-full px-2.5 py-1 text-sm font-semibold ${classes[tone]}`}>
        {value}
      </span>
    </div>
  );
}
