// import { Component, OnInit } from "@angular/core";
// import { CategoryService } from "../../../services/category.service";
// import { Router } from "@angular/router";
// import { ICategoryCreate } from "../../../../core/models/structureData";
// import { FormsModule } from "@angular/forms";
// @Component({
//   selector: "app-category-add",
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: "./category-add.component.html",
//   styleUrl: "./category-add.component.css",
// })
// export class CategoryAddComponent {
//   formData = {
//     name: "",
//     description: "",
//     sort_order: "",
//     status: 1,
//   };

//   constructor(
//     private categoryService: CategoryService,
//     private router: Router
//   ) {}

//   onSubmit() {
//     const payload: ICategoryCreate = {
//       name: this.formData.name,
//       description: this.formData.description,
//       sort_order: +this.formData.sort_order,
//       status: this.formData.status,
//     };

//     this.categoryService.create(payload).subscribe({
//       next: () => {
//         alert("Thêm danh mục thành công!");
//         this.router.navigate(["/admin/categories"]);
//       },
//       error: (err) => console.error(err),
//     });
//   }
// }

import { Component } from "@angular/core";
import { CategoryService } from "../../../services/category.service";
import { Router } from "@angular/router";
import { ICategoryCreate } from "../../../../core/models/structureData";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-category-add",
  standalone: true,
  imports: [FormsModule],
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

  // Hàm tạo slug từ tên
  createSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize("NFD") // loại bỏ dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-") // thay khoảng trắng thành "-"
      .replace(/(^-|-$)+/g, ""); // xóa "-" đầu & cuối
  }

  onSubmit() {
    const payload: ICategoryCreate = {
      name: this.formData.name,
      slug: this.createSlug(this.formData.name), // tự động sinh slug
      description: this.formData.description,
      sort_order: +this.formData.sort_order,
      status: this.formData.status,
    };

    this.categoryService.create(payload).subscribe({
      next: () => {
        alert("Thêm danh mục thành công!");
        this.router.navigate(["/admin/categories"]);
      },
      error: (err) => console.error("Lỗi tạo danh mục:", err),
    });
  }
}
