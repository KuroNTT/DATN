import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryService } from "../../../services/category.service";
import { ICategory } from "../../../../core/models/structureData";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-category-list",
  imports: [CommonModule],
  templateUrl: "./category-list.component.html",
  styleUrl: "./category-list.component.css",
})
export class CategoryListComponent {
  category_arr: ICategory[] = [];
  constructor(
    private CategoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.CategoryService.getAll().subscribe((data) => {
      this.category_arr = data;
    });
  }

  delete_category(id: number) {
    if (confirm("Bạn có chắc muốn xoá không?")) {
      this.CategoryService.delete(id).subscribe({
        next: () => {
          alert("Đã xoá danh mục thành công!");
          this.loadData(); // Refresh danh sách
        },
        error: (err) => {
          if (err.status === 400) {
            alert(err.error.message); // Thông báo lý do không xoá được
          } else {
            console.error("Lỗi xoá danh mục:", err);
          }
        },
      });
    }
  }

  edit_category(id: number) {
    this.router.navigate(["/admin/categories/edit", id]);
  }
  // test
  toggleStatus(category: ICategory) {
    const prevStatus = category.status;
    const newStatus = prevStatus === 1 ? 0 : 1;

    // Cập nhật ngay trên UI (optimistic)
    category.status = newStatus;

    this.CategoryService.update(category.id!, {
      ...category,
      status: newStatus,
    }).subscribe({
      next: () => {},
      error: (err) => {
        console.error("Lỗi khi cập nhật trạng thái:", err);
        category.status = prevStatus; // rollback nếu lỗi
      },
    });
  }
}
