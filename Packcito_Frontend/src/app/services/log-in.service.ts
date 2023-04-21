import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogInService {
  private baseURL: string = "http://localhost:3000/api/user"

  constructor(private _http: HttpClient) { }

  getToken():string{
    if(sessionStorage.getItem("token")!=null){
      return sessionStorage.getItem("token")!;
    }else {
      return "";
    }
  }

  postLogin(email: string, password: string){
    const datos = {
      "email": email, 
      "password": password
    }
    const options = {
      method: "POST",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    }
    return this._http.post(this.baseURL + '/login', datos, options)
  }

  public userLoggedIn(){ 
    var resultado = false;
     var usuario = sessionStorage.getItem("id"); 
     if(usuario!=null){ 
      resultado = true; 
    }
      return resultado }

  public logOut(){
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
  }

  public userLoggedId() {
    var usuario = sessionStorage.getItem("id");
    return usuario;
  }


}
