import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerAddComponent } from './banner-add.component';

describe('BannerAddComponent', () => {
  let component: BannerAddComponent;
  let fixture: ComponentFixture<BannerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
