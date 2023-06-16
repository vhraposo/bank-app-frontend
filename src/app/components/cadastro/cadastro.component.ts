import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CorrentistaService } from 'src/app/services/correntista.service';

@Component({
  selector: 'app-cadastro-correntista',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  cpf: any;
  nome: any;
  correntistaId: any; // Adicione uma nova variável para armazenar o ID do correntista

  constructor(
    private correntistaService: CorrentistaService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.nome = params['nome'];
      this.cpf = params['cpf'];
      this.correntistaId = params['id']; // Armazene o ID do correntista
    });
  }

  save(): void {


    if (!this.cpf || !this.nome) {
      this.toastr.error('Por favor, preencha todos os campos!');
      return;
    }

    const correntista = {
      cpf: this.cpf,
      nome: this.nome
    };

    console.log(correntista);

    if (this.correntistaId) {
      this.correntistaService.update(this.correntistaId, correntista).subscribe(
        response => {
          console.log(response);
          this.toastr.success('Correntista atualizado com sucesso!');
          this.router.navigate(['/correntistas']);
        },
        error => {
          console.log(error);
          this.toastr.error('Não foi possível atualizar o correntista!');
        }
      );
    } else {
      // validando se o usuário existe, se não vai ser chamado a criação:
      this.correntistaService.create(correntista).subscribe(
        response => {
          console.log(response);
          this.toastr.success('Correntista cadastrado com sucesso!');
          this.router.navigate(['/correntistas']);
        },
        error => {
          console.log(error);
          this.toastr.error('Não foi possível cadastrar o correntista!');
        }
      );
    }
  }
}
