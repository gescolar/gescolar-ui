import { environment } from './../../../environments/environment';
import { TurmaService } from './../../turmas/turna.service';
import { Http } from '@angular/http';
import { Aluno, Responsavel } from './../../core/model';
import { AlunosService } from './../alunos.service';
import { GrowMessageService } from './../../shared/grow-message.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../core/error-handler.service';

import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-alunos-cadastro',
  templateUrl: './alunos-cadastro.component.html',
  styleUrls: ['./alunos-cadastro.component.css']
})
export class AlunosCadastroComponent implements OnInit {

  formulario: FormGroup;
  turmas = [];
  responsaveis = [];
  uploadEmAndamento = false;
  pesquisandoMatriculaValida = false;


  exbindoFormularioResp = false;
  responsavel: Responsavel;

  constructor(private alunoService: AlunosService,
              private errorHandler: ErrorHandlerService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private messageService: GrowMessageService,
              private fb: FormBuilder,
              private turmaService: TurmaService ) { }

  ngOnInit() {

    const codigoAluno = this.route.snapshot.params['codigo'];
    this.configuraFormulario();
    this.title.setTitle('Cadastro Professor');


    if (codigoAluno) {
      this.carregarAluno(codigoAluno);
    }
    this.carregarTurmas();
    this.carregaFotoDefault();
  }


  configuraFormulario() {
    this.formulario = this.fb.group({
      'codigo': [],
      'nome': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
      'matricula': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]),
      [this.validatematricula.bind(this)]),
      'sexo': [],
      'foto': [],
      'urlFoto': [],
      'turma': this.fb.group({
        codigo: [ null, Validators.required ],
        nome: []
      }),
    });
  }



  validatematricula(control: AbstractControl) {
    this.pesquisandoMatriculaValida = true;
    return this.alunoService.matriculaExistente(control.value, this.formulario.get('codigo').value).then(res => {
      this.pesquisandoMatriculaValida = false;
      return res ? { matriculaExistente: true } : null ;
    });
  }

  carregarAluno(codigo: number) {
    this.alunoService.buscarPorCodigo(codigo)
      .then(aluno => {
        this.formulario.patchValue(aluno);
        this.atualizarTituloEdicao();
        this.carregaFotoDefault();
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
    this.carregaFotoDefault();
  }

   antesUploadAnexo(event) {
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.uploadEmAndamento = true;
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
    this.uploadEmAndamento = false;
  }

  erroUpload(event) {
    this.messageService.addErro('Erro ao tentar enviar foto!');
    this.uploadEmAndamento = false;
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição do Aluno: ${this.formulario.get('nome').value}`);
  }


  carregarTurmas() {
    return this.turmaService.listarTodas()
      .then(turmas => {
        console.log(turmas);
        this.turmas = turmas
          .map(t => ({ label: t.nome, value: t.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }


  carregaFotoDefault() {
    if (this.formulario.get('urlFoto').value === null) {
      this.formulario.get('urlFoto').setValue(environment.fotoAlunoDefault);
    }
  }



  adicionarResp() {
    this.exbindoFormularioResp = true;
    this.responsavel = new Responsavel();

  }



  confirmarResp(frm: FormControl) {
    frm.reset();
  }
}



