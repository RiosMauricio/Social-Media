import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { LogInService } from '../services/log-in.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL: string = "http://localhost:3000/api/user"
  constructor(private _http: HttpClient, private logInService: LogInService) { }

  //procedimiento para crear usuarios en el sistema.
  createUser(user: User): Observable<any> {
    const options = {
      method: "POST",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    }

    const datos = JSON.stringify(user);

    return this._http.post(this.baseURL + '/createUser', datos, options)
  }

  getUser(id: number): Observable<any> {
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    }
    return this._http.get(this.baseURL + '/getUser/' + id, options)
  }

  getUserCategories(id: number) {
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    }
    return this._http.get(this.baseURL + '/getUserCategories/' + id, options)

  }

  getAllUsers(): Observable<any> {
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    }
    return this._http.get(this.baseURL + '/getUsers/', options)
  }

  searchUsers(username: string): Observable<any>{
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    }
    return this._http.get(this.baseURL + '/getUserByUsername/' + username , options)
  }

  updateUser(user: User): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": this.logInService.getToken()
      })
    }

    const datos = JSON.stringify(user);
    console.log(user)

    return this._http.put(this.baseURL + '/updateUser/' + user.id, datos, options);
  }

  updatePassword(id: number, body: {}) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": this.logInService.getToken()
      })
    }

    const datos = JSON.stringify(body);
    console.log(body)

    return this._http.put(this.baseURL + '/updatePassword/' + id, datos, options);
  }

  updateProfilePhoto(id: number, image: FormData){
    return this._http.post(this.baseURL + '/updateProfilePhoto/' + id, image);
  }

  updateBanner(id: number, image: FormData){
    return this._http.post(this.baseURL + '/updateBanner/' + id, image);
  }

  //
}
