import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CategoryService } from "../../../services/category.service";
import { ICategory } from "../../../../core/models/structureData";

@Component({
  selector: "app-category-edit",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./category-edit.component.html",
  styleUrl: "./category-edit.component.css",
})
export class CategoryEditComponent implements OnInit {
  categoryId!: number;

  categoryData: ICategory = {
    id: 0,
    name: "",
    slug: "",
    description: "",
    sort_order: 0,
    status: 1,
  };

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get("id"));

    this.categoryService.getById(this.categoryId).subscribe((data) => {
      this.categoryData = data;
    });
  }
  updateCategory(): void {
    this.categoryService
      .update(this.categoryId, this.categoryData)
      .subscribe(() => {
        alert("Cập nhật thành công!");
        this.router.navigate(["/admin/categories"]);
      });
  }
}
