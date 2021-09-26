import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossingSiteComponent } from './crossing-site.component';

describe('CrossingSiteComponent', () => {
  let component: CrossingSiteComponent;
  let fixture: ComponentFixture<CrossingSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossingSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossingSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
