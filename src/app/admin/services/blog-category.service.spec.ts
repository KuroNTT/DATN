import { TestBed } from '@angular/core/testing';

import { BlogCategoryService } from './blog-category.service';

describe('BlogCategoryService', () => {
  let service: BlogCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
