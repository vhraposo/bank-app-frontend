import { User } from './user';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovimentacaoNewComponent } from './components/movimentacao-new/movimentacao-new.component';
import { MovimentacaoListComponent } from './components/movimentacao-list/movimentacao-list.component';
import { CorrentistaComponent } from './components/correntista/correntista.component';

import { UserLoginComponent } from './components/user-login/user-login.component'
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';


const routes: Routes = [
  { path: 'movimentacoes-new', component: MovimentacaoNewComponent },
  { path: 'movimentacoes', component: MovimentacaoListComponent},
  { path: 'correntistas', component: CorrentistaComponent},
  { path: 'cadastro', component: CadastroComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'mainscreen', component: MainScreenComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
