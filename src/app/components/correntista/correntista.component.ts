import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CorrentistaService } from 'src/app/services/correntista.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

import { MovimentacaoService } from 'src/app/services/movimentacao.service'; // Importe o serviço MovimentacaoService aqui
import { Router } from '@angular/router';



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

  route: any
  correntistaSelecionado: any = null;


  constructor(
    private correntistaService: CorrentistaService,
    private movimentacaoService: MovimentacaoService,
    private toastr: ToastrService,
    private router: Router
    ) {}

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

  editarCorrentista(correntista: any) {
    const queryParams = {
      nome: correntista.nome,
      cpf: correntista.cpf,
      id: correntista.id
    };

    this.router.navigate(['cadastro'], { queryParams });
  }



  gerarRelatorio(item: any): void {
    const doc = new jsPDF()

    // corpo do pdf
    doc.setFontSize(20);



    doc.text('Movimentações do Usuário', 10, 20)

    const nome = item.nome;
    const cpf = item.cpf;
    const numeroConta = item.conta.numero;
    const saldoAtual = item.conta.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const tableData = [
      ['Nome', nome],
      ['CPF', cpf],
      ['Conta N°', numeroConta],
      ['Saldo Atual', saldoAtual]
    ];
    const startY = 30;
    autoTable(doc, {
      // head: [["Informações Pessoais"] ],
      body: tableData,
      startY: startY
    })


    //buscando as movimentações no bd por id da conta
    this.movimentacaoService.findByIdConta(item.id).subscribe(

      data => {
        this.movimentacoes = data;
        console.log('hello',this.movimentacoes )

        // aqui vai adicionar  as receitas e desoesas no pdf
        doc.setFontSize(16)
        // autoTable(doc, {
          //   head: [['Despesas', 'R$', 'Receitas', 'R$']],
          //   body: [['Pizza', '-35', 'Salario', '2000']]
          //   })

          //  pegando as receitas e despesas
          const despesas = this.movimentacoes.filter((item: any) => item.tipo === 'DESPESA')
          const receitas = this.movimentacoes.filter((item: any) => item.tipo === 'RECEITA')
          const tableData = [['Despesas', 'R$', 'Receitas', 'R$']];

          const maxLength = Math.max(despesas.length, receitas.length);
          for (let i = 0; i < maxLength; i++) {
            const rowData = [
              i < despesas.length ? despesas[i].descricao : '',
              i < despesas.length ? `R$ ${despesas[i].valor}` : '',
              i < receitas.length ? receitas[i].descricao : '',
              i < receitas.length ? `R$ ${receitas[i].valor}` : ''
            ];

            tableData.push(rowData);
          }
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height;
        const tableHeight = 150
        const startY = (pageHeight - tableHeight) / 2;

        autoTable(doc, {
          head: [tableData[0]],
          body: tableData.slice(1),
          startY: startY // aqui vai ser a posição inicial da tabela como Y
        });

        // aqui vai salvar os arquivos para download
          doc.save(`Relatorio ${item.nome}-Fx Bank.pdf`)

      },

    )
  }

}
