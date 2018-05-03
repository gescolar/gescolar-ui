import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

import { environment } from './../../environments/environment';
import { Responsavel } from './../core/model';

export class ResponsavelFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class ResponsavelService {

  responsavelUrl: string;

  constructor(private http: AuthHttp) {
    this.responsavelUrl = `${environment.apiUrl}/responsaveis`;
  }

  pesquisar(filtro: ResponsavelFiltro): Promise<any> {
    const params = new URLSearchParams();

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.responsavelUrl}`, { search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const resp = responseJson.content;

        const resultado = {
          resp,
          total: responseJson.totalElements
        };

        return resultado;
      });
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.responsavelUrl)
      .toPromise()
      .then(response => response.json().content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.responsavelUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(responsavel: Responsavel): Promise<Responsavel> {
    return this.http.post(this.responsavelUrl, JSON.stringify(responsavel))
      .toPromise()
      .then(response => response.json());
  }

  atualizar(responsavel: Responsavel): Promise<Responsavel> {
    return this.http.put(`${this.responsavelUrl}/${responsavel.codigo}`,
        JSON.stringify(responsavel))
      .toPromise()
      .then(response => response.json() as Responsavel);
  }

  buscarPorCodigo(codigo: number): Promise<Responsavel> {
    return this.http.get(`${this.responsavelUrl}/${codigo}`)
      .toPromise()
      .then(response => response.json() as Responsavel);
  }


  cpfExistente(cpf: string, codigo: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.set('codigo', codigo);
    params.set('cpf', cpf);
    return this.http.get(`${this.responsavelUrl}/cpfExistente`, { search: params })
      .toPromise()
      .then(response => response.json());
  }

}
