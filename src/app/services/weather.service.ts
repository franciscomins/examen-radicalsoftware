import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'fb6742bfe9a0247ac921f36633535678';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private geocodeUrl = 'https://api.openweathermap.org/geo/1.0/reverse';

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`);
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`);
  }

  getCityByCoordinates(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.geocodeUrl}?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`);
  }
}

