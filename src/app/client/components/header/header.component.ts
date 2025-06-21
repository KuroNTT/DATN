import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { ICategory } from "../../../core/models/structureData";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}

  isMenuOpen = false;
  isShoesMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  toggleShoesMenu() {
    this.isShoesMenuOpen = !this.isShoesMenuOpen;
  }

  scrollToSection(id: string) {
    if (this.router.url === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      this.router.navigate(["/"], { fragment: id });
    }
  }

  category_arr: ICategory[] = [];
  filtered_categories: ICategory[] = [];

  ngOnInit(): void {
    this.getAllCategories();
    this.getCategoriesWithoutGender();
  }

  getAllCategories(): void {
    fetch("http://localhost:3000/api/categories").then((res) => {
      res
        .json()
        .then((data) => (this.category_arr = data as ICategory[]))
        .catch((error) =>
          console.log("Có lỗi khi lấy dữ liệu danh mục!: ", error)
        );
    });
  }

  getCategoriesWithoutGender(): void {
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        this.filtered_categories = (data as ICategory[]).filter(
          (cat) => cat.name !== "Giày nam" && cat.name !== "Giày nữ"
        );
      })
      .catch((error) =>
        console.log("Lỗi khi lọc danh mục không có Giày nam/nữ:", error)
      );
  }
}
