import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurmaPesquisaComponent } from './turma-pesquisa.component';

describe('TurmaPesquisaComponent', () => {
  let component: TurmaPesquisaComponent;
  let fixture: ComponentFixture<TurmaPesquisaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurmaPesquisaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurmaPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
