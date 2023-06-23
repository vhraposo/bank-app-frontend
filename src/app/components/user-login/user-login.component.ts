import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { LoginuserService } from 'src/app/services/loginuser.service'
import { User } from 'src/app/user'
import { ToastrService } from 'ngx-toastr'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  loginForm: FormGroup

  constructor(
    private loginuserService: LoginuserService,
    private toastr: ToastrService,
    private router: Router,
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createloginForm()
  }

  userLogin() {
    const user = new User()
    user.userId = this.loginForm.get("userId")?.value
    user.password = this.loginForm.get("password")?.value
    this.loginuserService.loginUser(user).subscribe(
      data => {
        this.toastr.success('Login realizado com sucesso!')
        this.router.navigate(['/mainscreen'])
      },
      error => {
        this.toastr.error('Não foi possível realizar login!')
      }
    )
  }

  createloginForm(): void{
    this.loginForm = this.FormBuilder.group({
      userId: [''],
      password: ['']
    })
  }
}
