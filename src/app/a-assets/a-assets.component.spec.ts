import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AAssetsComponent } from './a-assets.component';

describe('AAssetsComponent', () => {
  let component: AAssetsComponent;
  let fixture: ComponentFixture<AAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
