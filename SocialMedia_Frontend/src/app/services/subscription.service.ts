import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogInService } from './log-in.service';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseURL: string = "http://localhost:3000/api/subscription"

  constructor(private _http: HttpClient, private logInService: LogInService) { }

  
  subscribe(subscriberId: number, subscribedToId: number) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": this.logInService.getToken()
      })
    }
    return this._http.post(this.baseURL + '/suscribeToUser/' + subscriberId + "/" + subscribedToId, null, options);
  }

  checkSubscription(subscriberId: number, subscribedToId: number): Observable<any> {
    const options = {
      method: "GET",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": this.logInService.getToken()
      }),
    }
    return this._http.get(this.baseURL + '/checkSubscription/' + subscriberId + "/" + subscribedToId, options)
  }

  unSubscribe(subscriberId: number, subscribedToId: number) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": this.logInService.getToken()
      })
    }
    return this._http.delete(this.baseURL + '/unsubscribeFromUser/' + subscriberId + "/" + subscribedToId, options);
  }
}
