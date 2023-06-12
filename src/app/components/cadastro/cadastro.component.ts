import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CorrentistaService } from 'src/app/services/correntista.service';

@Component({
  selector: 'app-cadastro-correntista',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  cpf: any;
  nome: any;

  constructor(
    private correntistaService: CorrentistaService,
    private toastr: ToastrService,
    private router: Router) {}

  save(): void {
    const correntista = {
      cpf: this.cpf,
      nome: this.nome
    }
    console.log(correntista);
    this.correntistaService.create(correntista)
      .subscribe(
        response => {
          console.log(response);
          this.toastr.success("Correntista cadastrado com sucesso!");
          this.router.navigate(['/correntistas']);
        },
        error => {
          console.log(error);
          this.toastr.error("Não foi possível cadastrar o correntista!");
        }
      )
  }
}
