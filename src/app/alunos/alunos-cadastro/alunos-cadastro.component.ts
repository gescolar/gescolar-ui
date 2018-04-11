import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import { Aluno } from './../../core/model';
import { environment } from './../../../environments/environment';
import { AlunosService } from './../alunos.service';
import { GrowMessageService } from './../../shared/grow-message.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../core/error-handler.service';

import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-alunos-cadastro',
  templateUrl: './alunos-cadastro.component.html',
  styleUrls: ['./alunos-cadastro.component.css']
})
export class AlunosCadastroComponent implements OnInit {

  formulario: FormGroup;

  constructor(private alunoService: AlunosService,
              private errorHandler: ErrorHandlerService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private messageService: GrowMessageService,
              private fb: FormBuilder,
              private http: AuthHttp) { }

  ngOnInit() {

    const codigoAluno = this.route.snapshot.params['codigo'];
    this.configuraFormulario();
    this.title.setTitle('Cadastro Professor');

    if (codigoAluno) {
      this.carregarAluno(codigoAluno);
    }
  }


  configuraFormulario() {
    this.formulario = this.fb.group({
      'codigo': [],
      'nome': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
      'matricula': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]),
      [this.validatematricula.bind(this)]),
      'sexo': [],
      'foto': [],
      'urlFoto': []
    });
  }



  validatematricula(control: AbstractControl) {
    return this.alunoService.matriculaExistente(control.value).then(res => {
        return res ? { matriculaExistente: true } : null ;
    });
  }

  carregarAluno(codigo: number) {
    this.alunoService.buscarPorCodigo(codigo)
      .then(professor => {
        this.formulario.patchValue(professor);
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }


  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }


  salvar() {
    if (this.editando) {
      this.atualizarAluno();
    } else {
      this.adicionarAluno();
    }
  }

  adicionarAluno() {
    this.alunoService.adicionar(this.formulario.value)
      .then(alunoAdicionado => {
        this.messageService.addSucesso('Aluno adicionado com sucesso!');
        this.router.navigate(['/alunos', alunoAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarAluno() {
    this.alunoService.atualizar(this.formulario.value)
      .then(aluno => {
        this.formulario.patchValue(aluno);

        this.messageService.addSucesso('Aluno editado com sucesso!');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset();

    setTimeout(function () {
      this.aluno = new Aluno();
    }.bind(this), 1);

    this.router.navigate(['/alunos/nova']);
  }

   antesUploadAnexo(event) {
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
  }

  get urlUploadAnexo() {
    return `${environment.apiUrl}/fotos/upload`;
  }

  aoTerminarUploadAnexo(event) {
    const foto = JSON.parse(event.xhr.response);
    console.log(foto);
    this.formulario.patchValue({
      foto: foto.nome,
      urlFoto: foto.url
    });
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição do Aluno: ${this.formulario.get('nome').value}`);
  }


}



