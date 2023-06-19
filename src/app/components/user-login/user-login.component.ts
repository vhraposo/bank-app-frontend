import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginuserService } from 'src/app/services/loginuser.service';
import { User } from 'src/app/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  user: User = new User();

  constructor(
    private loginuserService: LoginuserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  userLogin() {
    console.log(this.user);
    this.loginuserService.loginUser(this.user).subscribe(
      data => {
        this.toastr.success('Login realizado com sucesso!');
        
        this.router.navigate(['/mainscreen']);
      },
      error => {
        this.toastr.error('Não foi possível realizar login!');
      }
    );
  }
}
