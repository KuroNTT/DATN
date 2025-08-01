import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BlogCategoryService } from "../../../services/blog-category.service";
import { BlogCategoryFormComponent } from "../components/blog-category-form/blog-category-form.component";
import { CommonModule } from "@angular/common";
import { IBlogCategory } from "../../../../core/models/structureData";

@Component({
  selector: "app-blog-category-add",
  standalone: true,
  imports: [CommonModule, BlogCategoryFormComponent],
  template: `
    <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 class="text-xl font-bold mb-4">Thêm danh mục blog</h2>

      <app-blog-category-form [onSubmitForm]="handleSubmit" />
    </div>
  `,
})
export class BlogCategoryAddComponent {
  constructor(
    private categoryService: BlogCategoryService,
    private router: Router
  ) {}

  handleSubmit = (formData: Partial<IBlogCategory>) => {
    this.categoryService.create(formData).subscribe(() => {
      alert("Thêm thành công!");
      this.router.navigate(["/admin/blog-categories"]);
    });
  };
}
