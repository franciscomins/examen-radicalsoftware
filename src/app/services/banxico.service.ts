import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanxicoService {
  private token = 'c47a0fea006717fcfc21e34b04576c32d809362863d1ee92bc16eeb6d9e5e948'; 

  constructor(private http: HttpClient) { }

  getFix(fechaIni: string, fechaFin: string, token: string): Observable<any> {
    const url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/${fechaIni}/${fechaFin}?mediaType=json&token=${token}`;
    return this.http.get(url);
  }
}
