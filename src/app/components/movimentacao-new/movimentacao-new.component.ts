import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CorrentistaService } from 'src/app/services/correntista.service';
import { MovimentacaoService } from 'src/app/services/movimentacao.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms'


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

  movimentacaoForm!: FormGroup;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  editMode: boolean = false
  id: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movimentacaoService: MovimentacaoService,
    private correntistaService: CorrentistaService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.exibirCorrentistas()
    this.checkEditMode()
    this.createMovimentacaoForm()

    this.route.queryParams.subscribe(params => {
      this.editMode = params['edit'] === 'true'
      if (params['id']) {
         this.getMovimentacaoById(params['id'])
      }
    })
  }

  createMovimentacaoForm(): void {
    this.movimentacaoForm = this.formBuilder.group({
      dataHora: [moment().format('YYYY-MM-DDTHH:mm:ss')],
      correntista: [''],
      descricao: [''],
      tipo: [''],
      valor: ['']
    });
  }


  getMovimentacaoById(id: string): void {

    this.movimentacaoService.findById(id).subscribe(
      data => {
        this.movimentacaoForm.patchValue({
          dataHora: moment(data.dataHora).format("YYYY-MM-DD"),
          correntista: this.correntistas.find((correntista:any) => correntista.id === data.idConta),
          descricao: data.descricao,
          tipo: data.tipo,
          valor: data.valor,

        })
        this.changeDetector.detectChanges()
      },
      error => {
        this.toastr.error("Erro ao obter ao obter a movimentação!")
      }
    )
  }

  exibirCorrentistas(): void {
    this.correntistaService.list().subscribe(
      (data) => {
        this.correntistas = data
      },
      (error) => {
        this.toastr.error("Erro ao exibir os correntistas!")
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
          this.dataHora = moment(movimentacao.dataHora).format("DD/MM/YYYY")
          this.descricao = movimentacao.descricao
          this.valor = movimentacao.valor
          this.tipo = movimentacao.tipo
          this.correntista = movimentacao.idConta
        },
        (error) => {
          this.toastr.error("Não foi possível recuperar os dados para edição!")
        }
      );
    }
  }


  save(): void {
    const movimentacao = {
      valor: this.movimentacaoForm.get("valor")?.value,
      descricao: this.movimentacaoForm.get("descricao")?.value,
      tipo: this.movimentacaoForm.get("tipo")!.value,

      idConta: this.movimentacaoForm.get("correntista")?.value.id,
      dataHora: moment(this.movimentacaoForm.get("dataHora")?.value).format('YYYY-MM-DDTHH:mm:ss')

    }

    if (this.editMode) {
      this.movimentacaoService.update(this.id, movimentacao).subscribe(
        (response) => {
          this.toastr.success('Movimentação atualizada com sucesso!')
          this.router.navigate(['/movimentacoes'])
        },
        (error) => {
          this.toastr.error('Não foi possível atualizar a movimentação')
        }
      )
    } else {
      this.movimentacaoService.create(movimentacao).subscribe(
        (response) => {
          this.toastr.success('Movimentação realizada com sucesso!')
          this.router.navigate(['/movimentacoes'])
        },
        (error) => {
          this.toastr.error('Não foi possível realizar a movimentação')
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/'], { relativeTo: this.route })
  }
}
