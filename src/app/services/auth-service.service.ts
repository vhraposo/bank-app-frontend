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

  login(token: string): void {
    this.loggedIn = true;
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('token', token)
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.setItem('loggedIn', 'false')
    localStorage.removeItem('token')
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }
}
