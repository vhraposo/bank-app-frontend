import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginuserService {
  // private baseUrl = "http://localhost:8080/user/login";
  private baseUrl = "http://slow-corn-production.up.railway.app/user/login";

  constructor(private httpClient: HttpClient) { }

  loginUser(user: User):Observable<object>{
    return this.httpClient.post(`${this.baseUrl}`, user);
  }
}
