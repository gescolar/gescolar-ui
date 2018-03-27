import { ProfessorCadastroComponent } from './professor-cadastro/professor-cadastro.component';
import { ProfessorPesquisaComponent } from './professor-pesquisa/professor-pesquisa.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './../seguranca/auth.guard';

const routes: Routes = [
  {
    path: 'professores',
    component: ProfessorPesquisaComponent
  },
  {
    path: 'professores/nova',
    component: ProfessorCadastroComponent
   },
  {
    path: 'professores/:codigo',
    component: ProfessorCadastroComponent,
   }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProfessoresRoutingModule { }
