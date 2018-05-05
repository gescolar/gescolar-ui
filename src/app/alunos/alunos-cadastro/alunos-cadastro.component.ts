import { TurmaService } from './../../turma/turma.service';
import { environment } from './../../../environments/environment';
import { Http } from '@angular/http';
import { Aluno, Responsavel } from './../../core/model';
import { AlunosService } from './../alunos.service';
import { GrowMessageService } from './../../shared/grow-message.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from './../../core/error-handler.service';

import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ResponsavelService } from '../responsavel.service';


@Component({
  selector: 'app-alunos-cadastro',
  templateUrl: './alunos-cadastro.component.html',
  styleUrls: ['./alunos-cadastro.component.css']
})
export class AlunosCadastroComponent implements OnInit {

  formulario: FormGroup;
  formularioResp: FormGroup;
  turmas = [];
  responsaveis = [];
  uploadEmAndamento = false;
  pesquisandoMatriculaValida = false;


  exbindoFormularioResp = false;
  responsavel: Responsavel;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  contatoIndex: number;
  pesquisandocpfValido = false;

  constructor(private alunoService: AlunosService,
              private errorHandler: ErrorHandlerService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private messageService: GrowMessageService,
              private fb: FormBuilder,
              private turmaService: TurmaService,
              private responsavelService: ResponsavelService ) { }

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
       this.initFormResp();
        this.formulario.patchValue(aluno);
        this.atualizarTituloEdicao();
        this.carregaFotoDefault();
        this.responsaveis = aluno.responsaveis;
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
    this.alunoService.adicionar(this.formulario.value, this.responsaveis)
      .then(alunoAdicionado => {
        this.messageService.addSucesso('Aluno adicionado com sucesso!');
        this.router.navigate(['/alunos', alunoAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarAluno() {
    this.alunoService.atualizar(this.formulario.value, this.responsaveis)
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

  novoResp() {
    this.responsavel = new Responsavel();
    this.exbindoFormularioResp = true;
    this.initFormResp();
    this.contatoIndex = this.responsaveis.length;

  }


initFormResp() {
  this.formularioResp = this.fb.group({
    'codigo': [],
    'nome' : new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
    'cpf': new FormControl('', Validators.compose([Validators.required, this.validateLocalCpf.bind(this)]),
     [this.validateCpf.bind(this)]),
    'parentesco': [],
    'email': new FormControl('', Validators.compose([Validators.pattern(this.emailPattern)])),
    'celular': [],
    'telefone': [],
  });
}


  validateLocalCpf(control: AbstractControl) {
    if (this.formularioResp && this.formularioResp.get('codigo').value === null && this.responsaveis && control && control.value
      && control.value.length === 14 &&
      this.responsaveis[this.contatoIndex] && this.responsaveis[this.contatoIndex].cpf === control.value) {
      return null;
    }
    if (this.responsaveis && control && control.value && control.value.length === 14) {
      for (const resp of this.responsaveis) {
        if (resp.cpf === control.value) {
          return { cpfExistenteLocal: true };
        }
      }
    }
  }

validateCpf(control: AbstractControl) {
  this.pesquisandocpfValido = true;
  return this.responsavelService.cpfExistente(control.value, this.formularioResp.get('codigo').value).then(res => {
    this.pesquisandocpfValido = false;
    return res ? { cpfExistente: true } : null ;
  });
}


  addResp() {
    this.exbindoFormularioResp = false;
    this.responsaveis[this.contatoIndex] = this.formularioResp.value;
  }

  clonarResp(resp: Responsavel): Responsavel {
    return new Responsavel(resp.codigo, resp.nome, resp.cpf,
      resp.email, resp.celular, resp.telefone, resp.parentesco);
  }

  prepararEdicaoResp(resp: Responsavel, index: number) {
    this.responsavel = new Responsavel();
    this.exbindoFormularioResp = true;
    setTimeout(function () {
      this.initFormResp();
    }.bind(this), 1);

    setTimeout(function () {
      this.formularioResp.patchValue(this.clonarResp(resp));
    }.bind(this), 1);



    this.contatoIndex = index;

  }
}




