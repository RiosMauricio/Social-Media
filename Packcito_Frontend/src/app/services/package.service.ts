import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogInService } from '../services/log-in.service';
import { Package } from '../models/package';


@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private baseURL: string = "http://localhost:3000/api/package"
  constructor(private _http: HttpClient, private logInService: LogInService) { }

  getPackByUser(userId: number){
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    }
    return this._http.get(this.baseURL + '/getPacks/' + userId, options)
  }

  getPackCategories(packId: number){
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    }
    return this._http.get(this.baseURL + '/getPackCategories/' + packId, options)
  }

  //procedimiento para crear usuarios en el sistema.
  createPackage(id: number, pack: Package): Observable<any> {
    const options = {
      method: "POST",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    }

    const datos = JSON.stringify(pack);

    return this._http.post(this.baseURL + '/createPackage/' + id, datos, options)
  }
}
