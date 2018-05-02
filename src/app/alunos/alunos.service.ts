import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

import { environment } from './../../environments/environment';
import { Aluno, Responsavel } from './../core/model';



export class AlunoFiltro {
  nome: string;
  matricula: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class AlunosService {

  alunoUrl: string;

  constructor(private http: AuthHttp) {
    this.alunoUrl = `${environment.apiUrl}/alunos`;
  }

  pesquisar(filtro: AlunoFiltro): Promise<any> {
    const params = new URLSearchParams();

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params.set('nome', filtro.nome);
    }

    if (filtro.matricula) {
      params.set('matricula', filtro.matricula);
    }

    return this.http.get(`${this.alunoUrl}`, { search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const alunos = responseJson.content;

        for (const aluno of alunos) {
          if (aluno.urlFoto === null) {
            aluno.urlFoto = environment.fotoAlunoDefault;
          }
      }

        const resultado = {
          alunos,
          total: responseJson.totalElements
        };

        console.log(resultado);
        return resultado;
      });
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.alunoUrl)
      .toPromise()
      .then(response => response.json().content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.alunoUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(aluno: Aluno, responsaveis: Responsavel []): Promise<Aluno> {
    aluno.responsaveis = responsaveis;
    return this.http.post(this.alunoUrl, JSON.stringify(aluno))
      .toPromise()
      .then(response => response.json());
  }

  atualizar(aluno: Aluno, responsaveis: Responsavel []): Promise<Aluno> {
    aluno.responsaveis = responsaveis;
    return this.http.put(`${this.alunoUrl}/${aluno.codigo}`,
        JSON.stringify(aluno))
      .toPromise()
      .then(response => response.json() as Aluno);
  }

  buscarPorCodigo(codigo: number): Promise<Aluno> {
    return this.http.get(`${this.alunoUrl}/${codigo}`)
      .toPromise()
      .then(response => response.json() as Aluno);
  }


  matriculaExistente(matricula: String, codigo: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.set('codigo', codigo);
    return this.http.get(`${this.alunoUrl}/matriculaExistente/${matricula}`, { search: params })
      .toPromise()
      .then(response => response.json());
  }

}
