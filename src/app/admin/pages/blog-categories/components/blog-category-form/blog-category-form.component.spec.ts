import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCategoryFormComponent } from './blog-category-form.component';

describe('BlogCategoryFormComponent', () => {
  let component: BlogCategoryFormComponent;
  let fixture: ComponentFixture<BlogCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategoryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
