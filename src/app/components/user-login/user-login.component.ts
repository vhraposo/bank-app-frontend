import { MovimentacaoService } from './../../services/movimentacao.service';
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
  movimentacoes: any
  totalReceitas = 0
  totalDespesas = 0
  loginForm: FormGroup

  constructor(
    private loginuserService: LoginuserService,
    private movimentacaoService: MovimentacaoService,
    private toastr: ToastrService,
    private router: Router,
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createloginForm()
    this.listMov()
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

  listMov():void{
    this.movimentacaoService.list().subscribe(
      data => {
        this.movimentacoes = data
        console.log(data)
        this.calcularmovimentacoes()
      }  )
  }

  calcularmovimentacoes(): void {
    this.totalReceitas = this.movimentacoes
      .filter((item: any) => item.tipo === 'RECEITA')
      .reduce((acc: number, item: any) => acc + item.valor, 0)

    this.totalDespesas = this.movimentacoes
      .filter((item: any) => item.tipo === 'DESPESA')
      .reduce((acc: number, item: any) => acc + item.valor, 0)
  }
}
