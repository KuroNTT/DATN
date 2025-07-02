import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ProductService } from "../../../core/services/product.service";
import { IProduct, ICategory } from "../../../core/models/structureData";
import { CommonModule, NgClass } from "@angular/common";

@Component({
  selector: "app-search-result",
  imports: [CommonModule, NgClass, RouterModule],
  templateUrl: "./search-result.component.html",
  styleUrls: ["./search-result.component.css"],
})
export class SearchResultComponent implements OnInit {
  searchQuery: string = "";
  searchResults: IProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params["q"] || "";
      if (this.searchQuery) {
        this.fetchResults();
      }
    });
    fetch("http://localhost:3000/api/categories").then((res) => {
      res
        .json()
        .then((data) => (this.category_arr = data as ICategory[]))
        .catch((error) =>
          console.log("Có lỗi khi lấy dữ liệu danh mục!: ", error)
        );
    });
  }

  async fetchResults() {
    try {
      this.searchResults = await this.productService.searchProducts(
        this.searchQuery
      );
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  }

  isPriceFilterVisible = true;
  isBrandFilterVisible = true;
  isSexFilterVisible = true;
  product_arr: IProduct[] = [];
  category_arr: ICategory[] = [];
  togglePriceFilter() {
    this.isPriceFilterVisible = !this.isPriceFilterVisible;
  }

  toggleBrandFilter() {
    this.isBrandFilterVisible = !this.isBrandFilterVisible;
  }
  toggleSexFilter() {
    this.isSexFilterVisible = !this.isSexFilterVisible;
  }
}
