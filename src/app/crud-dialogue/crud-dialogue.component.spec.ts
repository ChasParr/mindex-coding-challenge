import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudDialogueComponent } from './crud-dialogue.component';

describe('CrudDialogueComponent', () => {
  let component: CrudDialogueComponent;
  let fixture: ComponentFixture<CrudDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
    
    /*it('', () => {
        
    });*/
});
