export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  localtime: string;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  wind_mph: number;
  precip_mm: number;
  humidity: number;
  condition: WeatherCondition;
}

export interface HourWeather {
  time: string;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  wind_mph: number;
  precip_mm: number;
  chance_of_rain: number;
  condition: WeatherCondition;
}

export interface ForecastDayInfo {
  maxtemp_c: number;
  mintemp_c: number;
  totalprecip_mm: number;
  daily_chance_of_rain: number;
  condition: WeatherCondition;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: ForecastDayInfo;
  hour: HourWeather[];
}

export interface WeatherApiResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  forecast: {
    forecastday: ForecastDay[];
  };
}
