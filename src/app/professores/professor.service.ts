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

  professorUrl: string;

  constructor(private http: AuthHttp) {
    this.professorUrl = `${environment.apiUrl}/professores`;
  }

  pesquisar(filtro: ProfessorFiltro): Promise<any> {
    const params = new URLSearchParams();

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.professorUrl}`, { search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const professores = responseJson.content;

        for (const prof of professores) {
          if (prof.urlFoto === null) {
            prof.urlFoto = environment.fotoProfessor;
          }
        }

        const resultado = {
          professores,
          total: responseJson.totalElements
        };

        console.log(resultado);
        return resultado;
      });
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.professorUrl)
      .toPromise()
      .then(response => response.json().content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.professorUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(professor: Professor): Promise<Professor> {
    return this.http.post(this.professorUrl, JSON.stringify(professor))
      .toPromise()
      .then(response => response.json());
  }

  atualizar(professor: Professor): Promise<Professor> {
    return this.http.put(`${this.professorUrl}/${professor.codigo}`,
        JSON.stringify(professor))
      .toPromise()
      .then(response => response.json() as Professor);
  }

  buscarPorCodigo(codigo: number): Promise<Professor> {
    return this.http.get(`${this.professorUrl}/${codigo}`)
      .toPromise()
      .then(response => response.json() as Professor);
  }


  cpfExistente(cpf: string, codigo: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.set('codigo', codigo);
    params.set('cpf', cpf);
    return this.http.get(`${this.professorUrl}/cpfExistente`, { search: params })
      .toPromise()
      .then(response => response.json());
  }

}
