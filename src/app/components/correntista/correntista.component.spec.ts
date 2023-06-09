import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrentistaComponent } from './correntista.component';

describe('CorrentistaComponent', () => {
  let component: CorrentistaComponent;
  let fixture: ComponentFixture<CorrentistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorrentistaComponent]
    });
    fixture = TestBed.createComponent(CorrentistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
