import { Component, Input, SimpleChanges, OnChanges } from "@angular/core";
import { CommonModule, NgClass, NgFor } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { IProduct } from "../../../core/models/structureData";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { AuthService } from "../../services/auth.service";
import { WishlistService } from "../../services/wishlist.service";
import { FavoriteButtonComponent } from "../../components/favorite-button/favorite-button.component";
@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    RouterModule,
    NgxPaginationModule,
    FavoriteButtonComponent,
  ],
  templateUrl: "./product-list.component.html",
  styleUrl: "./product-list.component.css",
})
export class ProductListComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() products: IProduct[] = [];
  paginatedProducts: IProduct[] = [];
  pageSize: number = 6;
  totalPages: number = 1;

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["products"]) {
      // 1) Nếu user đăng nhập -> map isFavorited dựa trên wishlist
      const user = this.authService.getUser();
      if (user && Array.isArray(this.products) && this.products.length) {
        this.wishlistService.getFavoritesByUser(user.id).subscribe({
          next: (res) => {
            const favoritedIds: number[] = res.productIds || [];
            // gán cờ yêu thích cho mảng đang hiển thị
            this.products = this.products.map((p) => ({
              ...p,
              isFavorited: favoritedIds.includes(p.id),
            }));
            // 2) Tính lại phân trang sau khi gán isFavorited
            this.totalPages = Math.ceil(this.products.length / this.pageSize);
            this.currentPage = 1;
            this.setPaginatedProducts();
          },
          error: (err) => {
            console.error("❌ Lỗi lấy wishlist:", err);
            // vẫn hiển thị bình thường nếu lỗi
            this.totalPages = Math.ceil(this.products.length / this.pageSize);
            this.currentPage = 1;
            this.setPaginatedProducts();
          },
        });
      } else {
        // Không đăng nhập hoặc không có sản phẩm
        this.totalPages = Math.ceil(this.products.length / this.pageSize);
        this.currentPage = 1;
        this.setPaginatedProducts();
      }
    }
  }

  setPaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProducts = this.products.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.setPaginatedProducts();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
}
