import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDoppler(): Observable<any> {
    // Richiedi sempre 2000 frame
    return this.http.get(`${this.apiUrl}/doppler?max_frames=2000`);
  }

  getAngle(): Observable<any> {
    return this.http.get(`${this.apiUrl}/angle`);
  }

  getTargets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/targets`);
  }

  getChartData(): Observable<any> {
    console.log('Making HTTP request to:', `${this.apiUrl}/chart-data`);
    return this.http.get(`${this.apiUrl}/chart-data`);
  }
}
