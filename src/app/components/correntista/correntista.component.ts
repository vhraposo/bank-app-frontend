import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CorrentistaService } from 'src/app/services/correntista.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { MovimentacaoService } from 'src/app/services/movimentacao.service'; // Importe o serviço MovimentacaoService aqui



@Component({
  selector: 'app-correntista',
  templateUrl: './correntista.component.html',
  styleUrls: ['./correntista.component.css']
})
export class CorrentistaComponent {
  cpf:any;
  nome:any;
  correntistas: any;
  movimentacoes: any;

  constructor(
    private correntistaService: CorrentistaService,
    private movimentacaoService: MovimentacaoService,
    private toastr: ToastrService) {}

  ngOnInit(): void{
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
      }
    )
  }

  save(): void{
    const correntista = {
      id: null,
      cpf:this.cpf,
      nome:this.nome
    }
    console.log(correntista);
    this.correntistaService.create(correntista)
    .subscribe(
      response => {
        console.log(response)
        this.exibirCorrentistas()
        this.toastr.success("Correntista cadastrado com sucesso!")
      },
      error => {
        console.log(error)
        this.toastr.error("Não foi possível cadastrar o correntista!")
      }
    )
  }

  gerarRelatorio(item: any): void {
    const doc = new jsPDF()

    // corpo do pdf
    doc.setFontSize(20);
    doc.text('Movimentações do Usuário', 10, 20)

    doc.setFontSize(16);
    doc.text('Nome:', 10, 40)
    doc.text(item.nome, 50, 40)
    doc.text('Cpf N°:', 10, 50)
    doc.text(item.cpf, 50, 50)
    doc.text('Conta N°:', 10, 60);
    doc.text(item.conta.numero.toString(), 50, 60)
    doc.text('Saldo atual:', 10, 70)
    doc.text(`${item.conta.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 50, 70)

    //buscando as movimentações no bd por id da conta
    this.movimentacaoService.findByIdConta(item.id).subscribe(

      data => {
        this.movimentacoes = data;


        console.log('hello',this.movimentacoes )
        //  pegando as receitas e despesas
        const despesas = this.movimentacoes.filter((item: any) => item.tipo === 'DESPESA')
        const receitas = this.movimentacoes.filter((item: any) => item.tipo === 'RECEITA')

        // aqui vai adicionar  as receitas e desoesas no pdf
        doc.setFontSize(16)
        doc.text('Despesas:', 10, 90)
        doc.text('Receitas:', 100, 90)
        let posY = 100;
        const maxLength = Math.max(despesas.length, receitas.length)
        for (let i = 0; i < maxLength; i++) {
          if (i < despesas.length) {
            doc.text(despesas[i].descricao, 10, posY)
            doc.text(`R$ ${despesas[i].valor}`, 60, posY)
          }
          if (i < receitas.length) {
            doc.text(receitas[i].descricao, 100, posY)
            doc.text(`R$ ${receitas[i].valor}`, 160, posY)
          }
          posY += 10
        }

        // aqui vai salvar os arquivos para download
          doc.save(`Relatorio ${item.nome} - Fx Bank .pdf`)

      },

    )
  }

}
