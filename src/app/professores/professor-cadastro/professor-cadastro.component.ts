import { environment } from './../../../environments/environment';
import { GrowMessageService } from './../../shared/grow-message.service';
import { ProfessorService } from './../professor.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Title } from '@angular/platform-browser';

import { Professor } from './../../core/model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-professor-cadastro',
  templateUrl: './professor-cadastro.component.html',
  styleUrls: ['./professor-cadastro.component.css']
})
export class ProfessorCadastroComponent implements OnInit {

  formulario: FormGroup;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  pesquisandocpfValido = false;
  uploadEmAndamento = false;

  constructor(private professorService: ProfessorService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private messageService: GrowMessageService,
    private fb: FormBuilder) { }

  ngOnInit() {
    const codigoProfessor = this.route.snapshot.params['codigo'];
    this.configuraFormulario();
    this.title.setTitle('Cadastro Professor');

    if (codigoProfessor) {
      this.carregarProfessor(codigoProfessor);
    }

    this.carregaFotoDefault();
  }

  carregaFotoDefault() {
    if (this.formulario.get('urlFoto').value === null) {
      this.formulario.get('urlFoto').setValue(environment.fotoProfessor);
    }
  }

  configuraFormulario() {
    this.formulario = this.fb.group({
      'codigo': [],
      'nome': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
      'email': new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])),
      'cpf': new FormControl('', Validators.compose([Validators.required]),
      [this.validateCpf.bind(this)]),
      'telefone': [],
      'celular': [],
      'sexo': [],
      'foto': [],
      'urlFoto': []
    });
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }


  validateCpf(control: AbstractControl) {
    this.pesquisandocpfValido = true;
    return this.professorService.cpfExistente(control.value, this.formulario.get('codigo').value).then(res => {
      this.pesquisandocpfValido = false;
      return res ? { cpfExistente: true } : null ;
    });
  }

  carregarProfessor(codigo: number) {
    this.professorService.buscarPorCodigo(codigo)
      .then(professor => {
        this.formulario.patchValue(professor);
        this.atualizarTituloEdicao();
        this.carregaFotoDefault();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarProfessor();
    } else {
      this.adicionarProfessor();
    }
  }

  adicionarProfessor() {
    this.professorService.adicionar(this.formulario.value)
      .then(professorAdicionada => {
        this.messageService.addSucesso('Professor adicionada com sucesso!');
        this.router.navigate(['/professores', professorAdicionada.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarProfessor() {
    this.professorService.atualizar(this.formulario.value)
      .then(professor => {
        this.formulario.patchValue(professor);

        this.messageService.addSucesso('Professor editado com sucesso!');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset();

    setTimeout(function () {
      this.professor = new Professor();
    }.bind(this), 1);

    this.router.navigate(['/professores/nova']);
    this.carregaFotoDefault();
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição do Professor: ${this.formulario.get('nome').value}`);
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

}
