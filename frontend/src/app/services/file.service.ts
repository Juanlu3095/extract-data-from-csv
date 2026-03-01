import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  postCSV (form: any): Observable<Apiresponse> {
    return this.http.post(`${this.endpoint}/files`, form).pipe(
      tap(() => {
        this._refresh$.next()
      })
    )
  }
}
