import { Component, OnInit } from "@angular/core";
import { BlogService } from "../../../services/blog.service";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { IBlogCategory } from "../../../../core/models/structureData";
import { BlogCategoryService } from "../../../services/blog-category.service";

@Component({
  selector: "app-blog-list",
  standalone: true,
  template: `
    <div class="max-w-8xl p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Danh sách bài viết</h2>
        <div
          class="p-3 bg-sky-400 cursor-pointer flex items-center gap-3 rounded-md"
        >
          <i class="fa-solid fa-plus text-white"></i>
          <button
            routerLink="/admin/blogs/add"
            class="btn cursor-pointer font-bold text-white"
          >
            Thêm bài viết
          </button>
        </div>
      </div>

      <table class="table-auto w-full border border-gray-300">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="border p-2 text-center">ID</th>
            <th class="border p-2 text-center">Tiêu đề</th>
            <th class="border p-2 text-center">Slug</th>
            <th class="border p-2 text-center">Tác giả</th>
            <th class="border p-2 text-center">Danh mục bài viết</th>
            <th class="border p-2 text-center">Thumbnail</th>
            <th class="border p-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let blog of blogs" class="hover:bg-gray-50">
            <td class="border p-2">{{ blog.id }}</td>
            <td class="border p-2">{{ blog.title }}</td>
            <td class="border p-2">{{ blog.slug }}</td>
            <td class="border p-2">{{ blog.author?.name }}</td>
            <td class="border px-4 py-2 text-center">
              {{ getCategoryName(blog.category_id) }}
            </td>

            <td class="border p-2">
              <img
                *ngIf="blog.thumbnail"
                [src]="blog.thumbnail"
                alt="Thumbnail"
                class="w-20 h-16 object-cover rounded"
              />
            </td>
            <td
              class="border px-4 py-2 text-center items-center justify-center"
            >
              <div class="flex justify-center items-center gap-2">
                <button
                  (click)="editBlog(blog.id)"
                  class="text-white hover:underline cursor-pointer w-12 h-8 bg-blue-500 rounded-md"
                >
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button
                  (click)="deleteBlog(blog.id)"
                  class="text-white hover:underline cursor-pointer w-12 h-8 bg-red-500 rounded-md"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  imports: [CommonModule, RouterModule],
})
export class BlogListComponent implements OnInit {
  blogs: any[] = [];
  categories: IBlogCategory[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router,
    private blogCategoryService: BlogCategoryService
  ) {}

  ngOnInit(): void {
    this.blogService.getAll().subscribe((res) => {
      this.blogs = res;
      console.log(res);
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.blogCategoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error("Lỗi lấy danh mục:", err),
    });
  }

  editBlog(id: number) {
    this.router.navigate(["/admin/blogs/edit", id]);
  }

  deleteBlog(id: number) {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
      this.blogService.delete(id).subscribe(() => {
        this.blogs = this.blogs.filter((b) => b.id !== id);
      });
    }
  }

  getCategoryName(id: number | string | null | undefined): string {
    if (id === null || id === undefined) return "Không có danh mục";
    const category = this.categories.find(
      (cat) => Number(cat.id) === Number(id)
    );
    return category ? category.name : "Không có danh mục";
  }
}
