import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunosPesquisaComponent } from './alunos-pesquisa/alunos-pesquisa.component';
import { AlunosCadastroComponent } from './alunos-cadastro/alunos-cadastro.component';
import { AlunosRoutingModule } from './alunos-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AlunosRoutingModule
  ],
  declarations: [AlunosPesquisaComponent, AlunosCadastroComponent]
})
export class AlunosModule { }
