import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor() {
    this.loggedIn = localStorage.getItem('loggedIn') === 'true';
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login(): void {
    this.loggedIn = true
    localStorage.setItem('loggedIn', 'true')
  }

  logout(): void {
    this.loggedIn = false
    localStorage.setItem('loggedIn', 'false')
  }
}
