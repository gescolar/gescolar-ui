import { TurmaCadastroComponent } from './turma-cadastro/turma-cadastro.component';
import { TurmaPesquisaComponent } from './turma-pesquisa/turma-pesquisa.component';

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './../seguranca/auth.guard';

const routes: Routes = [
  {
    path: 'turmas',
    component: TurmaPesquisaComponent
  },
  {
    path: 'turmas/nova',
    component: TurmaCadastroComponent
   },
  {
    path: 'turmas/:codigo',
    component: TurmaCadastroComponent,
   }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TurmaRoutingModule { }
