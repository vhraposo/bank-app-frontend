import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MovimentacaoService } from 'src/app/services/movimentacao.service';

import { CorrentistaService } from './../../services/correntista.service';


@Component({
  selector: 'app-movimentacao-list',
  templateUrl: './movimentacao-list.component.html',
  styleUrls: ['./movimentacao-list.component.css']
})
export class MovimentacaoListComponent implements OnInit {
  movimentacoes: any
  totalMovimentacoes: any
  correntistas: any
  correntista: any
  listagemTitle?: string
  totalReceitas = 0
  totalDespesas = 0
  editMode = false
  movimentacaoForm!: FormGroup

  dataSource: MatTableDataSource<MovimentacaoService>
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private movimentacaoService: MovimentacaoService,
    private correntistaService: CorrentistaService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.dataSource = new MatTableDataSource<MovimentacaoService>()
  }

  ngOnInit(): void {
    this.exibirCorrentistas()
    this.listMovimentacoes()
  }

  exibirCorrentistas(): void {
    this.correntistaService.list().subscribe(
      data => {
        this.correntistas = data
      },
      error => {
        this.toastr.error("Não foi possível exibir os correntistas")
      }
    );
  }

  listMovimentacoes(): void {
    if (this.correntista) {
      this.movimentacaoService.findByIdConta(this.correntista.id).subscribe(
        data => {
          this.movimentacoes = data
          this.calcularTotais()
          this.listagemTitle = 'Listagem das movimentações por correntista'
          this.dataSource = new MatTableDataSource<MovimentacaoService>(this.movimentacoes)
          this.dataSource.paginator = this.paginator
        },
        error => {
          this.toastr.error("Erro ao listar as movimentações por correntista!");
        }
      );
    } else {
      this.movimentacaoService.list().subscribe(
        data => {
          this.movimentacoes = data
          this.calcularTotais()
          this.listagemTitle = 'Listagem de todas as movimentações'
          this.dataSource = new MatTableDataSource<MovimentacaoService>(this.movimentacoes)
          this.dataSource.paginator = this.paginator
        },
        error => {
          this.toastr.error("Erro ao listar as movimentações!")
        }
      );
    }
  }

  calcularTotais(): void {
    this.totalReceitas = this.movimentacoes
      .filter((item: any) => item.tipo === 'RECEITA')
      .reduce((acc: number, item: any) => acc + item.valor, 0)

    this.totalDespesas = this.movimentacoes
      .filter((item: any) => item.tipo === 'DESPESA')
      .reduce((acc: number, item: any) => acc + item.valor, 0)

    this.totalMovimentacoes = this.totalReceitas + Math.abs(this.totalDespesas)
  }
}
