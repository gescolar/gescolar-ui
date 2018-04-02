import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

import { environment } from './../../environments/environment';
import { Professor } from './../core/model';

export class ProfessorFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class ProfessorService {

  ProfessorUrl: string;

  constructor(private http: AuthHttp) {
    this.ProfessorUrl = `${environment.apiUrl}/professores`;
  }

  pesquisar(filtro: ProfessorFiltro): Promise<any> {
    const params = new URLSearchParams();

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.ProfessorUrl}`, { search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const professores = responseJson.content;

        const resultado = {
          professores,
          total: responseJson.totalElements
        };

        console.log(resultado);
        return resultado;
      });
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.ProfessorUrl)
      .toPromise()
      .then(response => response.json().content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.ProfessorUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(professor: Professor): Promise<Professor> {
    return this.http.post(this.ProfessorUrl, JSON.stringify(professor))
      .toPromise()
      .then(response => response.json());
  }

  atualizar(professor: Professor): Promise<Professor> {
    return this.http.put(`${this.ProfessorUrl}/${professor.idProfessor}`,
        JSON.stringify(professor))
      .toPromise()
      .then(response => response.json() as Professor);
  }

  buscarPorCodigo(codigo: number): Promise<Professor> {
    return this.http.get(`${this.ProfessorUrl}/${codigo}`)
      .toPromise()
      .then(response => response.json() as Professor);
  }

}
