import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {

  constructor(private http: HttpClient) { }

  list(): Observable<any>{
    return this.http.get(`${baseUrl}/movimentacoes`)
  }

  //find by id conta
  findByIdConta(idConta: any): Observable<any> {
    return this.http.get(`${baseUrl}/movimentacoes/findacc/${idConta}`)
  }

//find by id movimentação
  findById(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/movimentacoes/${id}`)
  }




  //POST
  create(movimentacao:any): Observable<any>{
    return this.http.post(`${baseUrl}/movimentacoes`, movimentacao)
  }

  update(idMovimentacao: any, movimentacao: any): Observable<any> {
    return this.http.put(`${baseUrl}/movimentacoes/${idMovimentacao}`, movimentacao)
  }


}
