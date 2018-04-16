import { GrowMessageService } from './../../shared/grow-message.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/components/common/api';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Title } from '@angular/platform-browser';
import { AlunoFiltro, AlunosService } from './../alunos.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-alunos-pesquisa',
  templateUrl: './alunos-pesquisa.component.html',
  styleUrls: ['./alunos-pesquisa.component.css']
})
export class AlunosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new AlunoFiltro();
  alunos = [];
  @ViewChild('tabela') grid;

  constructor(private title: Title,
    private alunoService: AlunosService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: GrowMessageService) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Alunos');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.alunoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.alunos = resultado.alunos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(aluno: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(aluno);
      }
    });
  }

  excluir(aluno: any) {
    this.alunoService.excluir(aluno.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }

       this.messageService.addSucesso('Aluno excluído com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
