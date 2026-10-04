import { NextRequest, NextResponse } from "next/server";

const WEATHER_API_URL = "https://api.weatherapi.com/v1/forecast.json";

function isCoordinateQuery(value: string) {
  const coordinatePattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
  return coordinatePattern.test(value);
}

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get("city")?.trim();
  const query = rawQuery || request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "A city name or latitude/longitude is required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather API key is missing." },
      { status: 500 }
    );
  }

  const url = new URL(WEATHER_API_URL);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", query);
  url.searchParams.set("days", "3");
  url.searchParams.set("aqi", "no");
  url.searchParams.set("alerts", "no");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();
      return NextResponse.json(
        { error: message || "Unable to fetch weather forecast." },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data?.location || !data?.current || !data?.forecast?.forecastday) {
      return NextResponse.json(
        { error: "Forecast data is invalid." },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while fetching weather forecast." },
      { status: 500 }
    );
  }
}
