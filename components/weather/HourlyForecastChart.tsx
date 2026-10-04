"use client";

import { useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { HourWeather } from "@/types/weather";

interface HourlyForecastChartProps {
  data: HourWeather[];
}

export default function HourlyForecastChart({ data }: HourlyForecastChartProps) {
  const [baseNow] = useState(() => Date.now());

  if (!data || data.length === 0) {
    return <div className="text-center text-slate-500">No hourly forecast data available</div>;
  }

  // Format data for charts (robust + deduplicate by timestamp)
  const mapped = data.map((hour, idx) => {
    const timeStr = hour.time ?? "";
    const date = timeStr ? new Date(timeStr) : new Date(baseNow + idx * 3600 * 1000);
    const timestamp = Number(date.valueOf());

    return {
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      temp: typeof hour.temp_c === "number" ? Math.round(hour.temp_c) : null,
      feelsLike: typeof hour.feelslike_c === "number" ? Math.round(hour.feelslike_c) : null,
      precip: typeof hour.precip_mm === "number" ? hour.precip_mm : 0,
      rainChance: typeof hour.chance_of_rain === "number" ? hour.chance_of_rain : 0,
      wind: typeof hour.wind_mph === "number" ? hour.wind_mph : 0,
      timestamp,
    };
  });

  // Remove duplicates (same timestamp) and sort
  const uniqMap = new Map<number, typeof mapped[0]>();
  mapped.forEach((m) => {
    if (!uniqMap.has(m.timestamp)) uniqMap.set(m.timestamp, m);
  });
  const chartData = Array.from(uniqMap.values()).sort((a, b) => a.timestamp - b.timestamp);

  // Color scheme for charts
  const colors = {
    temp: "#06b6d4",
    feelsLike: "#3b82f6",
    precip: "#0ea5e9",
    rainChance: "#60a5fa",
    wind: "#f59e0b",
  };

  return (
    <div className="space-y-8">
      {/* Temperature Chart */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-900">Temperature Trend</h4>
          <p className="mt-1 text-sm text-slate-600">24-hour temperature forecast with &quot;feels like&quot; index</p>
        </div>
        <div className="w-full h-56 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.temp} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.temp} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                tick={{ fill: "#64748b" }}
              />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} tick={{ fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
                formatter={(value) => {
                  if (typeof value === "number") {
                    return [`${value}°C`, ""];
                  }
                  return value;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temp"
                stroke={colors.temp}
                strokeWidth={3}
                dot={{ r: 4, fill: colors.temp }}
                activeDot={{ r: 6 }}
                name="Temperature"
              />
              <Line
                type="monotone"
                dataKey="feelsLike"
                stroke={colors.feelsLike}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Feels Like"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Precipitation & Rain Chance */}
      {/* Precipitation & Rain Chance chart removed per request to simplify UI */}

      {/* Wind Speed Chart */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-900">Wind Speed Analysis</h4>
          <p className="mt-1 text-sm text-slate-600">Wind speed forecast for the next 24 hours</p>
        </div>
        <div className="w-full h-56 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                tick={{ fill: "#64748b" }}
              />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} tick={{ fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
                formatter={(value) => {
                  if (typeof value === "number") {
                    return [`${value} mph`, "Wind Speed"];
                  }
                  return value;
                }}
              />
              <Bar
                dataKey="wind"
                fill={colors.wind}
                name="Wind Speed (mph)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(() => {
          const temps = chartData.map((d) => (typeof d.temp === 'number' ? d.temp : 0));
          const precips = chartData.map((d) => (typeof d.precip === 'number' ? d.precip : 0));
          const rainChances = chartData.map((d) => (typeof d.rainChance === 'number' ? d.rainChance : 0));
          const winds = chartData.map((d) => (typeof d.wind === 'number' ? d.wind : 0));

          return [
            {
              label: "Avg Temperature",
              value: `${Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)}°C`,
              icon: "🌡️",
              color: "bg-cyan-50 text-cyan-700",
            },
            {
              label: "Total Precipitation",
              value: `${(precips.reduce((a, b) => a + b, 0)).toFixed(1)} mm`,
              icon: "🌧️",
              color: "bg-blue-50 text-blue-700",
            },
            {
              label: "Max Rain Chance",
              value: `${Math.max(...rainChances)}%`,
              icon: "☔",
              color: "bg-sky-50 text-sky-700",
            },
            {
              label: "Avg Wind Speed",
              value: `${Math.round(winds.reduce((a, b) => a + b, 0) / winds.length)} mph`,
              icon: "💨",
              color: "bg-amber-50 text-amber-700",
            },
          ].map((metric, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border border-slate-200 ${metric.color} p-4`}
            >
              <div className="mb-2 text-2xl">{metric.icon}</div>
              <p className="text-sm font-medium text-slate-600">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold">{metric.value}</p>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}
