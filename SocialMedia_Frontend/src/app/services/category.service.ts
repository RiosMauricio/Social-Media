import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category'; 
 
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseURL: string = "http://localhost:3000/api/category"
  constructor(private _http: HttpClient) { }

  //procedimiento para crear usuarios en el sistema.
  getCategories(): Observable<any> {
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    }
    return this._http.get(this.baseURL + '/getall', options);
  }

  getCategory(id: number): Observable<any> {
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    }
    return this._http.get(this.baseURL+'/getCategoryById/'+id, options)
  }

  getCategoryUsers(id: number){
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    }
    return this._http.get(this.baseURL+'/getCategoryUsers/'+id, options)
  }

  //
}
