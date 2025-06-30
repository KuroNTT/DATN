import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit {
  blogs: any[] = [];
  category_arr: any[] = []; // ✅ Khai báo mảng danh mục
  private router = inject(Router);

  ngOnInit(): void {
    this.fetchAllBlogs();
  this.fetchCategories();     // ✅ Phải có dòng này!
  }

  fetchAllBlogs(): void {
    fetch('http://localhost:3000/api/blogs')
      .then(res => res.json())
      .then(data => {
        this.blogs = data;
      })
      .catch(err => console.error(err));
  }

  fetchCategories(): void {
    fetch('http://localhost:3000/api/blogs/categories/all') // ✅ Đảm bảo backend có route này
      .then(res => res.json())
      .then(data => {
        this.category_arr = data;
      })
      .catch(err => console.error(err));
  }

  goToBlog(id: number): void {
    this.router.navigateByUrl(`/blog/${id}`);
  }

  getPreviewText(html: string, maxLength: number = 100): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent?.substring(0, maxLength) + '...' || '';
  }

 selectedCategorySlug: string = ''; // Theo dõi danh mục đang chọn

filterByCategorySlug(slug: string): void {
  this.selectedCategorySlug = slug;

  fetch(`http://localhost:3000/api/blogs/category/${slug}`)
    .then(res => res.json())
    .then(data => {
      this.blogs = data;
    })
    .catch(err => console.error(err));
}

selectAllCategories(): void {
  this.selectedCategorySlug = ''; // Bỏ chọn tất cả
  this.fetchAllBlogs();           // Gọi lại toàn bộ blog
}

}
