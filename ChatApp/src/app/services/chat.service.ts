import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient, private user: UserService) {}
  url = 'https://localhost:5243/api/Messages';

  sendMessage(message: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.user.getToken()}`,
    });
    return this.http.post(this.url, message, { headers: headers });
  }

  getMessages(
    id: number
    // before?: Date,
    // count: number = 20,
    // sort: string = 'asc'
  ): Observable<any[]> {
    let token = localStorage.getItem('auth_token');
    console.log(token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    // let params = new HttpParams()
    //   .set('userId', userId)
    //   .set('count', count.toString())
    //   .set('sort', sort);

    // if (before) {
    //   params = params.set('before', before.toISOString());
    // }

    console.log(id);

    return this.http
      .get<any[]>(`http://localhost:5243/api/Messages/${id}`, {
        headers: headers,
      })
      .pipe(
        map((response: any) => {
          console.log('getMessages response:', response);
          return response.messages;
        })
      );
  }
}
