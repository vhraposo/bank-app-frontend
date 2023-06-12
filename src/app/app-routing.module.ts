import { User } from './user';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovimentacaoNewComponent } from './components/movimentacao-new/movimentacao-new.component';
import { MovimentacaoListComponent } from './components/movimentacao-list/movimentacao-list.component';
import { CorrentistaComponent } from './components/correntista/correntista.component';

import { UserLoginComponent } from './components/user-login/user-login.component'


const routes: Routes = [
  { path: 'movimentacoes-new', component: MovimentacaoNewComponent },
  { path: 'movimentacoes', component: MovimentacaoListComponent},
  { path: 'correntistas', component: CorrentistaComponent},
  { path: 'login', component: UserLoginComponent }, // Adicione a rota para o componente de login
  { path: '', redirectTo: 'login', pathMatch: 'full'}, // Redirecione a rota raiz ('') para a tela de login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
