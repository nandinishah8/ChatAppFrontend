import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  url = 'http://localhost:5243/api/Log';
  constructor(private http: HttpClient, private user: UserService) {}

  getLogs(startTime?: Date, endTime?: Date): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.user.getToken()}`,
    });

    let params = new HttpParams();

    if (startTime) {
      params = params.set('startTime', startTime.toISOString());
    }
    if (endTime) {
      params = params.set('endTime', endTime.toISOString());
    }

    return this.http
      .get<any>(this.url, { params: params })
      .pipe(map((response: any) => response.logs));
  }
}
