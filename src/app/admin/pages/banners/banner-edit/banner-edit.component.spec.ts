import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerEditComponent } from './banner-edit.component';

describe('BannerEditComponent', () => {
  let component: BannerEditComponent;
  let fixture: ComponentFixture<BannerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
