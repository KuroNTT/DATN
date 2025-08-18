import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BlogCategoryService } from "../../../services/blog-category.service";
import { BlogCategoryFormComponent } from "../components/blog-category-form/blog-category-form.component";
import { IBlogCategory } from "../../../../core/models/structureData";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-blog-category-edit",
  standalone: true,
  imports: [BlogCategoryFormComponent, CommonModule],
  template: `
    <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 class="text-xl font-bold mb-4">Chỉnh sửa danh mục bài viết</h2>
      <app-blog-category-form
        *ngIf="category"
        [initialData]="category"
        [onSubmitForm]="handleSubmit"
      ></app-blog-category-form>
    </div>
  `,
})
export class BlogCategoryEditComponent implements OnInit {
  category!: IBlogCategory;

  constructor(
    private route: ActivatedRoute,
    private categoryService: BlogCategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.categoryService.getById(+id).subscribe((data) => {
        this.category = data;
      });
    }
  }

  handleSubmit = (data: Partial<IBlogCategory>) => {
    if (!this.category?.id) return;
    this.categoryService.update(this.category.id, data).subscribe(() => {
      alert("Cập nhật thành công!");
      this.router.navigate(["/admin/blog-categories"]);
    });
  };
}
