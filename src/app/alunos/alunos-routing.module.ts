import { AlunosCadastroComponent } from './alunos-cadastro/alunos-cadastro.component';
import { AlunosPesquisaComponent } from './alunos-pesquisa/alunos-pesquisa.component';

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './../seguranca/auth.guard';

const routes: Routes = [
  {
    path: 'alunos',
    component: AlunosPesquisaComponent
  },
  {
    path: 'alunos/nova',
    component: AlunosCadastroComponent
   },
  {
    path: 'alunos/:codigo',
    component: AlunosCadastroComponent,
   }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AlunosRoutingModule { }
