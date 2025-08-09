import { Component, OnInit } from "@angular/core";
import { BannerService } from "../../../services/banner.service";
import { IBanner } from "../../../../core/models/structureData";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-banner-list",
  templateUrl: "./banner-list.component.html",
  styleUrls: ["./banner-list.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class BannerListComponent implements OnInit {
  banners: IBanner[] = [];

  constructor(private bannerService: BannerService, private router: Router) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners() {
    this.bannerService.getAll().subscribe({
      next: (data) => {
        this.banners = data;
      },
      error: (err) => {
        console.error("Error loading banners:", err);
      },
    });
  }

  onEdit(id: number) {
    this.router.navigate(["/admin/banners/edit", id]);
  }

  onDelete(id: number) {
    const confirmDelete = confirm("Bạn có chắc muốn xóa banner này?");
    if (confirmDelete) {
      this.bannerService.delete(id).subscribe({
        next: () => {
          alert("Xóa banner thành công!");
          this.banners = this.banners.filter((banner) => banner.id !== id);
        },
        error: () => {
          alert("Xóa banner thất bại!");
        },
      });
    }
  }

  onAdd() {
    this.router.navigate(["/admin/banners/add"]);
  }
}
