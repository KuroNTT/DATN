import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCategoryEditComponent } from './blog-category-edit.component';

describe('BlogCategoryEditComponent', () => {
  let component: BlogCategoryEditComponent;
  let fixture: ComponentFixture<BlogCategoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategoryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
