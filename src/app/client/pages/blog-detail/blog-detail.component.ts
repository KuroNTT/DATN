import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  imports: [CommonModule],
  templateUrl: './blog-detail.component.html',
})
export class BlogDetailComponent implements OnInit {
  blog: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  fetch(`http://localhost:3000/api/blogs/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Lỗi khi fetch blog');
      return res.json();
    })
    .then(data => this.blog = data)
    .catch(err => console.error('Lỗi:', err));
}
product_arr: any[] = [];


getRelatedProducts() {
  fetch("http://localhost:3000/api/products?limit=4")
    .then(res => res.json())
    .then(data => {
      this.product_arr = data;
    });
}

}
