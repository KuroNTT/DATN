import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlogCategoryService } from "../../../services/blog-category.service";
import { IBlogCategory } from "../../../../core/models/structureData";
import { Router } from "@angular/router";

@Component({
  selector: "app-blog-category-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./blog-category-list.component.html",
  styleUrls: ["./blog-category-list.component.css"],
})
export class BlogCategoryListComponent implements OnInit {
  categories: IBlogCategory[] = [];

  constructor(
    private categoryService: BlogCategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categoryService.getAll().subscribe((data) => (this.categories = data));
  }

  onDelete(id: number) {
    if (confirm("Bạn có chắc muốn xoá không?")) {
      this.categoryService.delete(id).subscribe(() => this.loadData());
    }
  }

  goToEdit(id: number) {
    this.router.navigate(["/admin/blog-categories/edit", id]);
  }

  goToAdd() {
    this.router.navigate(['/admin/blog-categories/add']);
  }
}
