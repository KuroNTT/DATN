import { Component, OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { ProductWishListService } from "../../../services/product-wish-list.service";
@Component({
  selector: "app-product-wish-list",
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: "./product-wish-list.component.html",
  styleUrls: ["./product-wish-list.component.css"],
})
export class ProductWishListComponent implements OnInit {
  wishlists_gop: any[] = []; // Danh sách sau khi gộp size
  wishlists: any[] = []; // Danh sách gốc từ API
  itemsPerPage = 5;
  currentPage = 1;

  constructor(private wishlistService: ProductWishListService) {}

  ngOnInit(): void {
    this.loadAllWishlists();
  }

  loadAllWishlists() {
    this.wishlistService.getAllWishlists().subscribe({
      next: (res) => {
        this.wishlists = Array.isArray(res) ? res : [];
        console.log("Ds yêu thích:", this.wishlists);
      },
      error: (err) => {
        console.error("Lỗi khi tải wishlist:", err);
        this.wishlists = [];
      },
    });
  }
}
