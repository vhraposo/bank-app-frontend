
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovimentacaoNewComponent } from './components/movimentacao-new/movimentacao-new.component';
import { MovimentacaoListComponent } from './components/movimentacao-list/movimentacao-list.component';
import { CorrentistaComponent } from './components/correntista/correntista.component';
import { AuthGuard } from 'src/app/guards/auth-guard.guard';
import { UserLoginComponent } from './components/user-login/user-login.component'
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';


const routes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: 'mainscreen', component: MainScreenComponent, canActivate: [AuthGuard] },
  { path: 'movimentacoes', component: MovimentacaoListComponent, canActivate: [AuthGuard]},
  { path: 'movimentacoes-new', component: MovimentacaoNewComponent, canActivate: [AuthGuard] },
  { path: 'correntistas', component: CorrentistaComponent, canActivate: [AuthGuard]},
  { path: 'cadastro', component: CadastroComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
