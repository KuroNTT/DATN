import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BlogService } from "../../../services/blog.service";
import { BlogFormComponent } from "../components/blog-form/blog-form.component";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import { IBlogCreate } from "../../../../core/models/structureData";

@Component({
  selector: "app-blog-add",
  standalone: true,
  template: `
    <div class="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Thêm bài viết</h2>
      <app-blog-form
        (formSubmit)="onSubmit($event)"
        [currentAuthorName]="currentUser?.name"
        [authorId]="currentUser?.id"
      />
    </div>
  `,
  imports: [CommonModule, BlogFormComponent],
})
export class BlogAddComponent {
  currentUser: any;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  onSubmit(formData: Partial<any>) {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser?.id) {
      alert("Không thể xác định người dùng.");
      return;
    }

    const file = formData["thumbnail"];

    if (file instanceof File) {
      const uploadData = new FormData();
      uploadData.append("file", file);

      this.blogService.uploadImage(uploadData).subscribe({
        next: (res) => {
          const imageUrl = res.imageUrl;

          const blogPayload = {
            title: formData["title"] || "",
            slug: formData["slug"] || "",
            content: formData["content"] || "",
            author_id: currentUser.id,
            category_id: formData["category_id"] || "",
            thumbnail: imageUrl,
          };

          this.blogService.createBlog(blogPayload).subscribe(() => {
            alert("Thêm bài viết thành công!");
            this.router.navigate(["/admin/blogs"]);
          });
        },
        error: () => {
          alert("Tải ảnh thất bại");
        },
      });
    } else {
      alert("Vui lòng chọn ảnh thumbnail!");
    }
  }
}
