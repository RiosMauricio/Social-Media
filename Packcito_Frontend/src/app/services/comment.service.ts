import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { LogInService } from './log-in.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseURL: string = "http://localhost:3000/api/comment"

  constructor(private _http: HttpClient, private logInService: LogInService) { }

  getCommentByPost(postId: number){
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": this.logInService.getToken()
      }),
    }
    return this._http.get(this.baseURL + '/getCommentsByPost/' + postId, options)
  }

  createComment(comment: Comment, userId: number, postId: number): Observable<any> {
    const options = {
      method: "POST",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": this.logInService.getToken()
      })
    }

    const datos = JSON.stringify(comment);

    return this._http.post(this.baseURL + '/createComment/'+ userId + "/" + postId, datos, options)
  }


}
