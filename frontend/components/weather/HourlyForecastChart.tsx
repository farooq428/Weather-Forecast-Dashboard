"use client";

import {
  ComposedChart,
  Line,
  Bar,
  BarChart,
  LineChart,
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
  if (!data || data.length === 0) {
    return <div className="text-center text-slate-500">No hourly forecast data available</div>;
  }

  // Format data for charts
  const chartData = data.map((hour) => ({
    time: new Date(hour.time).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    temp: Math.round(hour.temp_c),
    feelsLike: Math.round(hour.feelslike_c),
    precip: hour.precip_mm,
    rainChance: hour.chance_of_rain,
    wind: hour.wind_mph,
    timestamp: new Date(hour.time).getTime(),
  }));

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
          <p className="mt-1 text-sm text-slate-600">24-hour temperature forecast with "feels like" index</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-900">Precipitation & Rain Chance</h4>
          <p className="mt-1 text-sm text-slate-600">Expected rainfall and probability over the next 24 hours</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                tick={{ fill: "#64748b" }}
              />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                tick={{ fill: "#64748b" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                tick={{ fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
                formatter={(value, name) => {
                  if (name === "rainChance") return [`${value}%`, "Rain Chance"];
                  if (name === "precip") return [`${value} mm`, "Precipitation"];
                  return value;
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="precip" fill={colors.precip} name="Precipitation (mm)" radius={[8, 8, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rainChance"
                stroke={colors.rainChance}
                strokeWidth={3}
                dot={{ r: 3, fill: colors.rainChance }}
                activeDot={{ r: 5 }}
                name="Rain Chance (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Wind Speed Chart */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-900">Wind Speed Analysis</h4>
          <p className="mt-1 text-sm text-slate-600">Wind speed forecast for the next 24 hours</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
          const temps = chartData.map((d) => d.temp);
          const precips = chartData.map((d) => d.precip);
          const rainChances = chartData.map((d) => d.rainChance);
          const winds = chartData.map((d) => d.wind);

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
