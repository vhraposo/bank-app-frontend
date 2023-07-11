import { Component } from '@angular/core';
import { AuthService } from './services/auth-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FX Money';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) {}

  logout() {
    this.authService.logout()
    this.router.navigate(['/login'])
    this.toastr.success('Logout realizado com sucesso!')
  }

}
