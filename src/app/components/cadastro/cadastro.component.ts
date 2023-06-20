import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CorrentistaService } from 'src/app/services/correntista.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-correntista',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  cpf: any;
  nome: any;
  correntistaId: any;
  cep: any;
  logradouro: any;
  complemento: any;
  bairro: any;
  cidade: any;
  estado: any

  constructor(
    private correntistaService: CorrentistaService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.nome = params['nome'];
      this.cpf = params['cpf'];
      this.cep = params['cep'];
      this.logradouro = params['logradouro']
      this.complemento = params['complemento']
      this.bairro = params['bairro']
      this.cidade = params['cidade']
      this.estado = params['estado']


      this.correntistaId = params['id'];
    });
  }

  save(): void {
    if (!this.cpf || !this.nome) {
      this.toastr.error('Por favor, preencha todos os campos!');
      return;
    }

    const correntista = {
      nome: this.nome,
      cpf: this.cpf,
      cep: this.cep,
      logradouro: this.logradouro,
      complemento: this.complemento,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado
    };

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

  fetchAddress(): void {
    const cep = this.cep
    const url = `https://viacep.com.br/ws/${cep}/json/`

    this.http.get(url).subscribe(
      (data: any) => {
        if (data.erro) {
          this.toastr.error('CEP não encontrado!')
        } else {
          this.cep = data.cep
          this.logradouro = data.logradouro
          this.complemento = data.complemento
          this.bairro = data.bairro
          this.cidade = data.localidade
          this.estado = data.uf
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
