import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

// const baseUrl = 'http://localhost:8080'
const baseUrl =  'slow-corn-production.up.railway.app'

@Injectable({
  providedIn: 'root'
})
export class CorrentistaService {

  constructor(private http: HttpClient) { }

  list(): Observable<any>{
    return this.http.get(`${baseUrl}/correntistas`)
  }
  create(correntista:any): Observable<any> {
    return this.http.post(`${baseUrl}/correntistas`, correntista)
  }

  update(correntistaId: any, correntista: any): Observable<any> {
    const url = `${baseUrl}/correntistas/${correntistaId}`
    return this.http.put(url, correntista)
  }

  delete(id: number): Observable<any> {
    const url = `${baseUrl}/correntistas/${id}`
    return this.http.delete(url)
  }

}
