import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient, private user: UserService) {}
  url = 'https://localhost:5243/api/Messages';

  makeHttpRequest() {
    this.http
      .get('https://localhost:5243/api/Messages')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // Client-side or network error occurred
            console.error('Error occurred:', error.error.message);
          } else {
            // Server returned an error response
            console.error(
              `Server returned code ${error.status}, body was:`,
              error.error
            );
          }

          // Return an empty observable or throw the error to propagate it further
          return throwError('Something bad happened; please try again later.');
        })
      )
      .subscribe((response) => {
        // Handle successful response
        console.log('Response:', response);
      });
  }

  sendNewMessage(receiverId: number, message: any): Observable<any> {
    const body = { receiverId, message };
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.url, body, { headers: headers });
  }

  getMessages(id: number): Observable<any[]> {
    let token = localStorage.getItem('auth_token');
    console.log(token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

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

  // editMessage(id: number, message: any): Observable<any> {
  //   let token = localStorage.getItem('auth_token');
  //   console.log(token);

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   // const body = { content: content };

  //   /* return this.http.put<any[]>(`${this.url}/${messageId}`, editMessage, {
  //     headers: headers,
  //   });*/
  //   return this.http
  //     .put<any[]>(`http://localhost:5243/api/Messages/${id}`, message, {
  //       headers: headers,
  //     })
  //     .pipe(
  //       map((response: any) => {
  //         console.log(' response:', response);
  //         return response.message;
  //       })
  //     );
  // }

  updateMessage(messageId: number, newContent: string): Observable<any> {
    const url = `${this.url}/${messageId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    const updatedMessage: any = { id: messageId, content: newContent }; // Assuming your Message interface or model has an 'id' property

    return this.http
      .put<any>(url, updatedMessage, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  deleteMessage(messageId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.user.getToken()}`,
    });

    return this.http.delete<any>(`${this.url}/${messageId}`, {
      headers: headers,
    });
  }
}
