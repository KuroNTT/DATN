import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-detail.component.html',
})
export class BlogDetailComponent implements OnInit {
  blog: any = null;
  product_arr: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
console.log('Slug nhận được:', slug); // In ra kiểm tra

    if (slug) {
      fetch(`http://localhost:3000/api/blogs/slug/${slug}`)
        .then(res => {
          if (!res.ok) throw new Error('Lỗi khi fetch blog');
          return res.json();
        })
        .then(data => this.blog = data)
        .catch(err => console.error('Lỗi:', err));
    }

    this.getRelatedProducts();
  }

  getRelatedProducts() {
    fetch("http://localhost:3000/api/products?limit=4")
      .then(res => res.json())
      .then(data => {
        this.product_arr = data;
      });
  }
}
