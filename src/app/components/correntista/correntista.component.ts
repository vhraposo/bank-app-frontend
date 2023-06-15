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
    doc.text(`Nome: ${item.nome}`, 10, 40)
    doc.text(`Conta N°: ${item.conta.numero}`, 10, 50)
    doc.text(`Saldo atual: R$ ${item.conta.saldo }`, 10, 60)

    //buscando as movimentações no bd
    this.movimentacaoService.findByIdConta(item.id).subscribe(

      data => {
        this.movimentacoes = data;


        console.log('hello',this.movimentacoes )
        //  pegando as receitas e despesas
        const despesas = this.movimentacoes.filter((item: any) => item.tipo === 'DESPESA')
        const receitas = this.movimentacoes.filter((item: any) => item.tipo === 'RECEITA')

        // aqui vai adicionar  as despesas no pdf
        doc.setFontSize(16);
        doc.text('Despesas:', 10, 80)
        let posY = 90;
        despesas.forEach((despesa: any) => {
          doc.text(`${despesa.descricao}: ${despesa.valor}`, 10, posY)
          posY += 10;

        });

        // aqui vai adicionar  as receitas no pdf
        doc.setFontSize(16);
        doc.text('Receitas:', 10, posY)
        posY += 10;
        receitas.forEach((receita: any) => {
          doc.text(`${receita.descricao}: ${receita.valor}`, 10, posY)
          posY += 10;
        });

        // aqui vai salvar os arquivos para download
          doc.save('relatorio.pdf');

      },

    )
  }

}
