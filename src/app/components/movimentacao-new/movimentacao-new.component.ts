import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CorrentistaService } from 'src/app/services/correntista.service';
import { MovimentacaoService } from 'src/app/services/movimentacao.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-movimentacao-new',
  templateUrl: './movimentacao-new.component.html',
  styleUrls: ['./movimentacao-new.component.css']
})
export class MovimentacaoNewComponent implements OnInit {
  correntistas: any;
  correntista: any;

  dataHora: any;
  descricao: any;
  valor: any;
  tipo: any;

  editMode: boolean = false
  id: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movimentacaoService: MovimentacaoService,
    private correntistaService: CorrentistaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.exibirCorrentistas()
    this.checkEditMode()
  }

  exibirCorrentistas(): void {
    this.correntistaService.list().subscribe(
      (data) => {
        this.correntistas = data
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkEditMode(): void {
    this.editMode = this.route.snapshot.queryParams['edit'] === 'true'
    this.id = this.route.snapshot.queryParams['id']

    if (this.editMode) {
      this.movimentacaoService.findByIdConta(this.id).subscribe(
        (response) => {
          const movimentacao = response
          this.dataHora = movimentacao.dataHora
          this.descricao = movimentacao.descricao
          this.valor = movimentacao.valor
          this.tipo = movimentacao.tipo
          this.correntista = movimentacao.idConta
        },
        (error) => {
          console.log(error)
        }
      );
    }
  }


  save(): void {
    const movimentacao = {
      valor: this.valor,
      descricao: this.descricao,
      tipo: this.tipo,
      idConta: this.correntista.id,
      dataHora: moment(this.dataHora).format('YYYY-MM-DDTHH:mm:ss')
    };
    console.log(movimentacao)

    if (this.editMode) {
      this.movimentacaoService.update(this.id, movimentacao).subscribe(
        (response) => {
          console.log(response)
          this.toastr.success('Movimentação atualizada com sucesso!')
          this.router.navigate(['/movimentacoes'])
        },
        (error) => {
          console.log(error);
          this.toastr.error('Não foi possível atualizar a movimentação')
        }
      )
    } else {
      this.movimentacaoService.create(movimentacao).subscribe(
        (response) => {
          console.log(response);
          this.toastr.success('Movimentação realizada com sucesso!')
          this.router.navigate(['/movimentacoes'])
        },
        (error) => {
          console.log(error)
          this.toastr.error('Não foi possível realizar a movimentação')
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/'], { relativeTo: this.route })
  }
}
