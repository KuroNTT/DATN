import { Component } from "@angular/core";
import { ProductFilterComponent } from "./components/product-filter/product-filter.component";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { IProduct } from "../../../core/models/structureData";

import { HttpClient, HttpParams } from "@angular/common/http";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [ProductFilterComponent, ProductListComponent],
  templateUrl: "./products.component.html",
})
export class ProductsComponent {
  product_arr: IProduct[] = [];
  product_arr_all: IProduct[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllProducts();
  }

  fetchAllProducts(): void {
    this.http.get<IProduct[]>("http://localhost:3000/api/products").subscribe({
      next: (data) => {
        this.product_arr_all = data;
        this.product_arr = data;
      },
      error: (err) => console.error("Lỗi khi lấy tất cả sản phẩm:", err),
    });
  }

  onFilterChanged(filter: {
    categories: number[];
    brands: number[];
    sizes: number[];
    genders: number[];
    prices: { min: number; max: number }[];
  }) {
    this.product_arr = this.product_arr_all.filter((p) => {
      const matchPrice =
        filter.prices.length === 0 ||
        filter.prices.some((r) => p.price >= r.min && p.price < r.max);
      const matchCategory =
        filter.categories.length === 0 ||
        filter.categories.includes(Number(p.category_id));

      const matchBrand =
        filter.brands.length === 0 ||
        filter.brands.includes(Number(p.brand_id));

      const matchSize =
        filter.sizes.length === 0 || filter.sizes.includes(Number(p.size_id));
      const matchGender =
        filter.genders.length === 0 ||
        filter.genders.includes(Number(p.gender_id));

      return (
        matchPrice && matchCategory && matchBrand && matchSize && matchGender
      );
    });

    console.log("Kết quả lọc:", this.product_arr);
  }
}
