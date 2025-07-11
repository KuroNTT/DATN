import { Component, OnInit } from "@angular/core";
import { BlogService } from "../../../services/blog.service";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Router } from "@angular/router";

@Component({
  selector: "app-blog-list",
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: "./blog-list.component.html",
  styleUrl: "./blog-list.component.css",
})
export class BlogListComponent implements OnInit {
  blogs: any[] = [];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.blogService.getAll().subscribe((data) => {
      this.blogs = data;
    });
  }
  goToEdit(id: number) {
    this.router.navigate(["/admin/blogs/edit", id]);
  }
}
