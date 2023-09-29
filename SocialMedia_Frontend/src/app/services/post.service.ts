import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogInService } from './log-in.service';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseURL: string = "http://localhost:3000/api/post"

  constructor(private _http: HttpClient, private logInService: LogInService) { }

  getPostsByPackage(packId: number){
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": this.logInService.getToken()
      }),
    }
    return this._http.get(this.baseURL + '/getAllPostsByPackage/' + packId, options)
  }

  getPost(postId: number){
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": this.logInService.getToken()
      }),
    }
    return this._http.get(this.baseURL + '/getPost/' + postId, options)
  
  }

  //procedimiento para crear usuarios en el sistema.
  createPost(idPack: number, post: Post, media: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < media.length; i++) {
      formData.append('media', media[i]);
    }    
    formData.append('title', post.title);
    formData.append('description', post.description);

    const options = {
      method: "POST",
      headers: new HttpHeaders({
        "enctype": "multipart/form-data", //se cambia el encabezado porque estamos trabajando con formdata para este procedimiento.
        "authorization": this.logInService.getToken()
      })
    }

    return this._http.post(this.baseURL + '/createPost/' + idPack, formData, options)
  }
}
