import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BlogService } from "../../../services/blog.service";
import { IBlog } from "../../../../core/models/structureData";

@Component({
  selector: "app-blog-edit",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./blog-edit.component.html",
  styleUrls: ["./blog-edit.component.css"],
})
export class BlogEditComponent implements OnInit {
  blogId!: number;
  blogData: IBlog = {
    id: 0,
    title: "",
    content: "",
    thumbnail: "",
    category_id: 0,
    author_id: "1",
    created_at: "",
    updated_at: "",
    slug: "",
    is_published: 1,
    status: 1,
    sort_order: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.blogId = Number(this.route.snapshot.paramMap.get("id"));
    this.blogService.getById(this.blogId).subscribe((data) => {
      this.blogData = data;
    });
  }

  updateBlog() {
    this.blogService.update(this.blogId, this.blogData).subscribe(() => {
      alert("Cập nhật thành công!");
      this.router.navigate(["/admin/blogs"]);
    });
  }
}
