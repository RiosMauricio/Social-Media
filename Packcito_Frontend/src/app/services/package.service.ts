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

  getPacksByUser(userId: number){
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

  getPack(packId: number){
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    }
    return this._http.get(this.baseURL + '/getPack/' + packId, options)
  }

  //procedimiento para crear usuarios en el sistema.
  createPackage(idUser: number, pack: Package, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('icon', file);
    formData.append('title', pack.title);
    formData.append('description', pack.description);
    formData.append('price', pack.price.toString());

    const options = {
      method: "POST",
      headers: new HttpHeaders({
        "enctype": "multipart/form-data", //se cambia el encabezado porque estamos trabajando con formdata para este procedimiento.
        "authorization": this.logInService.getToken()
      })
    }

    return this._http.post(this.baseURL + '/createPackage/' + idUser, formData, options)
  }
}
