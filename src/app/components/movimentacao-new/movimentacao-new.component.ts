import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CorrentistaService } from 'src/app/services/correntista.service';
import { MovimentacaoService } from 'src/app/services/movimentacao.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-movimentacao-new',
  templateUrl: './movimentacao-new.component.html',
  styleUrls: ['./movimentacao-new.component.css']

})
export class MovimentacaoNewComponent implements OnInit {



  correntistas:any;
  correntista:any;

  dataHora: any;
  descricao:any;
  valor: any;
  tipo: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movimentacaoService: MovimentacaoService,
    private correntistaService: CorrentistaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.exibirCorrentistas();

  }

  exibirCorrentistas(): void{
    this.correntistaService.list()
    .subscribe(
      data => {
        this.correntistas = data;
        console.log(data);
      },
      error => {
        console.log(error);
      })
  }
  save(): void{
   console.log(this.correntista)
    const movimentacao = {
      valor:this.valor,
      descricao:this.descricao,
      tipo:this.tipo,
      idConta:this.correntista.id,
      dataHora:this.dataHora
    }

  console.log(movimentacao)


  this.movimentacaoService.create(movimentacao)
  .subscribe(
    response => {
      console.log(response);
      this.toastr.success("Movimentação realizada com sucesso!")
      this.goBack();
    },
    error => {
      console.log(error);
      this.toastr.error("Não foi possível realizar a movimentação")
    }
  )


  }

  goBack(): void {
    this.router.navigate(['/'], { relativeTo: this.route });
  }

}
