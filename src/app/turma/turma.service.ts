import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

import { environment } from './../../environments/environment';
import { Turma } from './../core/model';

export class TurmaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class TurmaService {

  turmaUrl: string;

  constructor(private http: AuthHttp) {
    this.turmaUrl = `${environment.apiUrl}/turmas`;
  }

  pesquisar(filtro: TurmaFiltro): Promise<any> {
    const params = new URLSearchParams();

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.turmaUrl}`, { search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const turmas = responseJson.content;

        const resultado = {
          turmas,
          total: responseJson.totalElements
        };

         return resultado;
      });
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.turmaUrl)
      .toPromise()
      .then(response => response.json().content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.turmaUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(turma: Turma): Promise<Turma> {
    return this.http.post(this.turmaUrl, JSON.stringify(turma))
      .toPromise()
      .then(response => response.json());
  }

  atualizar(turma: Turma): Promise<Turma> {
    return this.http.put(`${this.turmaUrl}/${turma.codigo}`,
        JSON.stringify(turma))
      .toPromise()
      .then(response => response.json() as Turma);
  }

  buscarPorCodigo(codigo: number): Promise<Turma> {
    return this.http.get(`${this.turmaUrl}/${codigo}`)
      .toPromise()
      .then(response => response.json() as Turma);
  }


}
