import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCategoryAddComponent } from './blog-category-add.component';

describe('BlogCategoryAddComponent', () => {
  let component: BlogCategoryAddComponent;
  let fixture: ComponentFixture<BlogCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategoryAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
