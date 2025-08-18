import { Component, OnInit } from "@angular/core";
import { BlogService } from "../../../services/blog.service";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { IBlogCategory } from "../../../../core/models/structureData";
import { BlogCategoryService } from "../../../services/blog-category.service";
import { NgxPaginationModule } from "ngx-pagination";

@Component({
  selector: "app-blog-list",
  standalone: true,
  template: `
    <div class="max-w-8xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Danh sách bài viết</h2>
        <button
          routerLink="/admin/blogs/add"
          class="flex items-center px-4 py-1.5 border border-gray-300 rounded-full 
      text-md text-gray-700 hover:bg-black hover:text -white transition cursor-pointer"
        >
          <i class="fa-solid fa-plus mr-2"></i>Thêm bài viết
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-md text-left border border-gray-300">
          <thead class="bg-gray-200 text-center">
            <tr class="bg-gray-200 text-left">
              <th class="px-2 py-2 border w-[60px] text-center">ID</th>
              <th class="px-4 py-2 border w-[250px]">Tiêu đề</th>
              <th class="px-4 py-2 border w-[200px]">Slug</th>
              <th class="px-4 py-2 border w-[150px]">Tác giả</th>
              <th class="px-4 py-2 border w-[180px] text-center">Danh mục</th>
              <th class="px-4 py-2 border w-[120px] text-center">Thumbnail</th>
              <th class="px-2 py-2 border w-[100px] text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="
                let blog of blogs
                  | paginate : { itemsPerPage: 5, currentPage: p }
              "
              class="hover:bg-gray-50 text-center"
            >
              <td class="px-4 py-2 border">{{ blog.id }}</td>
              <td class="px-4 py-2 border text-left">{{ blog.title }}</td>
              <td class="px-4 py-2 border text-left">{{ blog.slug }}</td>
              <td class="px-4 py-2 border">{{ blog.author?.name }}</td>
              <td class="px-4 py-2 border">
                {{ getCategoryName(blog.category_id) }}
              </td>
              <td class="px-4 py-2 border">
                <img
                  *ngIf="blog.thumbnail"
                  [src]="blog.thumbnail"
                  alt="Thumbnail"
                  class="w-16 h-12 object-cover mx-auto"
                />
              </td>
              <td class="px-4 py-2 border">
                <div class="flex justify-center items-center gap-3">
                  <button
                    (click)="editBlog(blog.id)"
                    class="text-gray-700 hover:text-gray-500"
                  >
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    (click)="deleteBlog(blog.id)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination-template #pg="paginationApi" (pageChange)="p = $event">
          <div class="flex justify-center items-center mt-6 space-x-2">
            <!-- Nút Trước -->
            <button
              class="w-9 h-9 flex items-center justify-center rounded-full border border-[#c5c5c5] bg-white text-black hover:bg-black hover:text-white transition-shadow duration-200 shadow-sm hover:shadow-md"
              [disabled]="pg.isFirstPage()"
              (click)="pg.previous()"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <!-- Số trang -->
            <ng-container *ngFor="let page of pg.pages">
              <button
                class="w-9 h-9 flex items-center justify-center rounded-full border text-sm transition-all duration-200"
                [ngClass]="{
                  'bg-black text-white shadow-md':
                    pg.getCurrent() === page.value,
                  'bg-white text-black border-[#c5c5c5] hover:bg-[#f3f3f3]':
                    pg.getCurrent() !== page.value
                }"
                (click)="pg.setCurrent(page.value)"
              >
                {{ page.label }}
              </button>
            </ng-container>

            <!-- Nút Sau -->
            <button
              class="w-9 h-9 flex items-center justify-center rounded-full border border-[#c5c5c5] bg-white text-black hover:bg-black hover:text-white transition-shadow duration-200 shadow-sm hover:shadow-md"
              [disabled]="pg.isLastPage()"
              (click)="pg.next()"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </pagination-template>
      </div>
    </div>
  `,
  imports: [CommonModule, RouterModule, NgxPaginationModule],
})
export class BlogListComponent implements OnInit {
  blogs: any[] = [];
  categories: IBlogCategory[] = [];
  p: number = 1;
  constructor(
    private blogService: BlogService,
    private router: Router,
    private blogCategoryService: BlogCategoryService
  ) {}

  ngOnInit(): void {
    this.blogService.getAll().subscribe((res) => {
      this.blogs = res;
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
