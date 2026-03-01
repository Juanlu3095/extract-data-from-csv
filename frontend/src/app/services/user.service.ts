import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Apiresponse } from '../entities/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endpoint = environment.ApiEndPoint
  public _refresh$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  getUsers (parameter?: string): Observable<Apiresponse> {
    let httpParams = new HttpParams()
    if (parameter) httpParams = httpParams.set("q", parameter.toLowerCase())
    return this.http.get(`${this.endpoint}/users`, { params: httpParams })
  }
}
