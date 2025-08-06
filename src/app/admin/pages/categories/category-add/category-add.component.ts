import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../../../services/category.service";
import { Router } from "@angular/router";
import { ICategoryCreate } from "../../../../core/models/structureData";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-category-add",
  imports: [FormsModule],
  standalone: true,
  templateUrl: "./category-add.component.html",
  styleUrl: "./category-add.component.css",
})
export class CategoryAddComponent {
  formData = {
    name: "",
    description: "",
    sort_order: "",
    status: 1,
  };

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  onSubmit() {
    const payload: ICategoryCreate = {
      name: this.formData.name,
      description: this.formData.description,
      sort_order: +this.formData.sort_order, // ép kiểu nếu là số
      status: this.formData.status,
    };

    this.categoryService.create(payload).subscribe({
      next: () => {
        alert("Thêm danh mục thành công!");
        this.router.navigate(["/admin/categories"]);
      },
      error: (err) => console.error(err),
    });
  }
}
