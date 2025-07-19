import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BlogService } from "../../../services/blog.service";
import { BlogFormComponent } from "../components/blog-form/blog-form.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-blog-edit",
  standalone: true,
  template: `
    <div class="max-w-3xl mx-auto p-6 bg-white shadow rounded" *ngIf="blog">
      <h2 class="text-xl font-bold mb-4">Chỉnh sửa bài viết</h2>
      <app-blog-form [initialData]="blog" (formSubmit)="onSubmit($event)" />
    </div>
  `,
  imports: [CommonModule, BlogFormComponent],
})
export class BlogEditComponent implements OnInit {
  blog: any;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.blogService.getById(+id).subscribe((data) => {
        const blogWithAuthorName = {
          ...data,
          author: data.author?.name || "Không rõ",
          author_id: data.author_id || data.author?.id || null,
        };

        this.blog = blogWithAuthorName;
      });
    }
  }

  onSubmit(data: any) {
    console.log("Received data from form:", data);
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) return;

    const updatedData = {
      ...data,
      author_id: this.blog.author_id || this.blog.author?.id,
    };

    if (updatedData.author && typeof updatedData.author === "object") {
      delete updatedData.author;
    }

    const thumbnail = updatedData.thumbnail;

    if (thumbnail instanceof File) {
      const formData = new FormData();
      formData.append("file", thumbnail);

      this.blogService.uploadImage(formData).subscribe({
        next: (res) => {
          updatedData.thumbnail = res.imageUrl;

          this.sendUpdateRequest(+id, updatedData);
        },
        error: (err) => {
          console.error("❌ Upload thumbnail thất bại:", err);
          alert("Tải ảnh thất bại. Vui lòng thử lại.");
        },
      });
    } else {
      this.sendUpdateRequest(+id, updatedData);
    }
  }

  private sendUpdateRequest(id: number, data: any) {
    console.log("➡️ Dữ liệu gửi lên server:", data);
    this.blogService.update(id, data).subscribe({
      next: () => {
        alert("Cập nhật bài viết thành công!");
        this.router.navigate(["/admin/blogs"]);
      },
      error: (err) => {
        console.error("Lỗi khi cập nhật:", err);
        alert("Có lỗi xảy ra khi cập nhật!");
      },
    });
  }
}
