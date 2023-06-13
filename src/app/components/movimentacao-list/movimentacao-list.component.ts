import { CorrentistaService } from './../../services/correntista.service';
import { Component, OnInit } from '@angular/core';
import { MovimentacaoService } from 'src/app/services/movimentacao.service';

@Component({
  selector: 'app-movimentacao-list',
  templateUrl: './movimentacao-list.component.html',
  styleUrls: ['./movimentacao-list.component.css']
})
export class MovimentacaoListComponent implements OnInit {
  movimentacoes: any;
  correntistas: any;
  correntista: any;
  listagemTitle?: string;
  totalReceitas: number = 0;
  totalDespesas: number = 0;

  constructor(
    private movimentacaoService: MovimentacaoService,
    private correntistaService: CorrentistaService
  ) {}

  ngOnInit(): void {
    this.exibirCorrentistas();
    this.listMovimentacoes();
  }

  exibirCorrentistas(): void {
    this.correntistaService.list().subscribe(
      data => {
        this.correntistas = data;
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  listMovimentacoes(): void {
    if (this.correntista) {
      this.movimentacaoService.findByIdConta(this.correntista.id).subscribe(
        data => {
          this.movimentacoes = data;
          this.calcularTotais();
          this.listagemTitle = 'Listagem das movimentações por correntista';
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.movimentacaoService.list().subscribe(
        data => {
          this.movimentacoes = data;
          this.calcularTotais();
          this.listagemTitle = 'Listagem de todas as movimentações';
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  calcularTotais(): void {
    this.totalReceitas = this.movimentacoes
      .filter((item: any) => item.tipo === 'RECEITA')
      .reduce((acc: number, item: any) => acc + item.valor, 0);

    this.totalDespesas = this.movimentacoes
      .filter((item: any) => item.tipo === 'DESPESA')
      .reduce((acc: number, item: any) => acc + item.valor, 0);
  }

}
