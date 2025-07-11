import { Component, OnInit } from "@angular/core";
import { BlogService } from "../../../services/blog.service";
import { Router } from "@angular/router";
import { IBlogCreate } from "../../../../core/models/structureData";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-blog-add",
  templateUrl: "./blog-add.component.html",
  styleUrls: ["./blog-add.component.css"],
  standalone: true,
  imports: [FormsModule],
})
export class BlogAddComponent implements OnInit {
  formData = {
    title: "",
    slug: "",
    content: "",
    thumbnail: "",
    category_id: "",
    author_id: 1,
  };

  blogCategories: any[] = [];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.blogService.getCategories().subscribe({
      next: (data) => {
        this.blogCategories = data;
      },
      error: (err) => console.error(err),
    });
  }

  onSubmit() {
    const payload: IBlogCreate = {
      ...this.formData,
      category_id: +this.formData.category_id, // ép kiểu từ string sang number
    };

    this.blogService.createBlog(payload).subscribe({
      next: () => {
        alert("Thêm bài viết thành công!");
        this.router.navigate(["/admin/blogs"]);
      },
      error: (err) => console.error(err),
    });
  }
}
