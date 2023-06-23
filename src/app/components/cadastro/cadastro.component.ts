import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { CorrentistaService } from 'src/app/services/correntista.service'
import { HttpClient } from '@angular/common/http'
import { FormBuilder, FormGroup } from '@angular/forms'


const URL_PREFIX = `https://viacep.com.br/ws/`
const URL_SUFFIX = `/json/`

@Component({
  selector: 'app-cadastro-correntista',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  correntistaId: string
  cadastroForm: FormGroup

  constructor(
    private correntistaService: CorrentistaService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.createcadastroForm()
    this.activatedRoute.queryParams.subscribe(params => {
      this.cadastroForm.patchValue({
        nome: params['nome'],
        cpf: params['cpf'],
        cep: params['cep'],
        logradouro: params['logradouro'],
        complemento: params['complemento'],
        bairro: params['bairro'],
        cidade: params['cidade'],
        estado: params['estado']
      })

      this.correntistaId = params['id']
    })

  }

  createcadastroForm(): void {
    this.cadastroForm = this.formBuilder.group({
      nome: [''],
      cpf: [''],
      cep: [''],
      logradouro: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    })
  }

  save(): void {
    if (!this.cadastroForm.get("cpf")?.value || !this.cadastroForm.get("nome")?.value) {
      this.toastr.error('Por favor, preencha todos os campos!')
      return
    }

    const correntista = {
      nome: this.cadastroForm.get("nome")?.value,
      cpf: this.cadastroForm.get("cpf")?.value,
      cep: this.cadastroForm.get("cep")?.value,
      logradouro: this.cadastroForm.get("logradouro")?.value,
      complemento: this.cadastroForm.get("complemento")?.value,
      bairro: this.cadastroForm.get("bairro")?.value,
      cidade: this.cadastroForm.get("cidade")?.value,
      estado: this.cadastroForm.get("estado")?.value,
    }

    if (this.correntistaId) {
      this.correntistaService.update(this.correntistaId, correntista).subscribe(
        response => {
          this.toastr.success('Correntista atualizado com sucesso!')
          this.router.navigate(['/correntistas'])
        },
        error => {
          this.toastr.error('Não foi possível atualizar o correntista!')
        }
      )
    } else {
      this.correntistaService.create(correntista).subscribe(
        response => {
          this.toastr.success('Correntista cadastrado com sucesso!')
          this.router.navigate(['/correntistas'])
        },
        error => {
          this.toastr.error('Não foi possível cadastrar o correntista!')
        }
      )
    }
  }

  fetchAddress(): void {

    const cep = this.cadastroForm.get("cep")?.value
    if(cep && cep.length !== 8){
      return
    }
    this.http.get(`${URL_PREFIX}${cep}${URL_SUFFIX}`).subscribe(
      (data: any) => {
        if (data.erro) {
          this.toastr.error('CEP não encontrado!')
        } else {
          this.cadastroForm.patchValue({
            logradouro: data.logradouro,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          })
        }
      },
      error => {
        this.toastr.error('Preencha o campo Cep!')
      }
    )
  }

}
