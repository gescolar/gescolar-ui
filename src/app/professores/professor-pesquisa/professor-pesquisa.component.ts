import { GrowMessageService } from './../../shared/grow-message.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService, LazyLoadEvent } from 'primeng/components/common/api';
import { ErrorHandlerService } from './../../core/error-handler.service';

import { ProfessorFiltro, ProfessorService } from './../professor.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-professor-pesquisa',
  templateUrl: './professor-pesquisa.component.html',
  styleUrls: ['./professor-pesquisa.component.css']
})
export class ProfessorPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new ProfessorFiltro();
  professores = [];
  @ViewChild('tabela') grid;


  constructor(private title: Title,
    private professorService: ProfessorService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: GrowMessageService) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de professores');
  }



  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.professorService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.professores = resultado.professores;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(professor: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(professor);
      }
    });
  }

  excluir(professor: any) {
    this.professorService.excluir(professor.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }

       this.messageService.addSucesso('Professor excluído com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
