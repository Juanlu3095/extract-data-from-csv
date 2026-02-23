import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Apiresponse } from '../entities/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  endpoint = environment.ApiEndPoint
  public _refresh$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  getUsers (parameter?: string): Observable<Apiresponse> {
    let httpParams = new HttpParams()
    if (parameter) httpParams = httpParams.set("q", parameter.toLowerCase())
    return this.http.get(`${this.endpoint}/users`, { params: httpParams })
  }

  postCSV (file: File): Observable<Apiresponse> {
    return this.http.post(`${this.endpoint}/files`, file).pipe(
      tap(() => {
        this._refresh$.next()
      })
    )
  }
}
