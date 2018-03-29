import { GrowMessageService } from './../../shared/grow-message.service';
import { ProfessorService } from './../professor.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Title } from '@angular/platform-browser';

import { Professor } from './../../core/model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-professor-cadastro',
  templateUrl: './professor-cadastro.component.html',
  styleUrls: ['./professor-cadastro.component.css']
})
export class ProfessorCadastroComponent implements OnInit {

  professor = new Professor();
  userform: FormGroup;

  constructor(private professorService: ProfessorService,
              private errorHandler: ErrorHandlerService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private messageService: GrowMessageService,
              private fb: FormBuilder) { }

  ngOnInit() {
    const codigoProfessor = this.route.snapshot.params['codigo'];

    this.title.setTitle('Cadastro Professor');

    if (codigoProfessor) {
      this.carregarProfessor(codigoProfessor);
    }

    this.userform = this.fb.group({
      'nome': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]))
     });

  }

  get editando() {
    return Boolean(this.professor.idProfessor);
  }


  carregarProfessor(codigo: number) {
    this.professorService.buscarPorCodigo(codigo)
      .then(professor => {
        this.professor = professor;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarProfessor(form);
    } else {
      this.adicionarProfessor(form);
    }
  }

  adicionarProfessor(form: FormControl) {
    this.professorService.adicionar(this.professor)
      .then(professorAdicionada => {
        this.messageService.addSucesso('Professor adicionada com sucesso!');
        this.router.navigate(['/professor', professorAdicionada.idProfessor]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarProfessor(form: FormControl) {
    this.professorService.atualizar(this.professor)
      .then(professor => {
        this.professor = professor;

        this.messageService.addSucesso('Professor editado com sucesso!');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  nova(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.professor = new Professor();
    }.bind(this), 1);

    this.router.navigate(['/professor/nova']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição do Professor: ${this.professor.nome}`);
  }

  get diagnostic() { return JSON.stringify(this.userform.value); }

}
