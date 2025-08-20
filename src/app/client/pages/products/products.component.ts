import { Component, OnInit } from "@angular/core";
import { ProductFilterComponent } from "../../components/product-filter/product-filter.component";
import { ProductListComponent } from "../product-list/product-list.component";
import { IProduct } from "../../../core/models/structureData";
import { NgxPaginationModule } from "ngx-pagination";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { ActivatedRoute, Route } from "@angular/router";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [
    ProductFilterComponent,
    ProductListComponent,
    NgxPaginationModule,
    CommonModule,
  ],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  product_arr: IProduct[] = [];
  product_arr_all: IProduct[] = [];
  p: number = 1;

  ngOnInit(): void {
    this.fetchAllProducts();
    this.route.queryParams.subscribe((params) => {
      const categoryId = +params["category"];
      if (categoryId) {
        this.onFilterChanged({
          categories: [categoryId],
          brands: [],
          sizes: [],
          genders: [],
          shoeHeights: [],
          prices: [],
          colors: [],
        });
      }
    });
  }

  fetchAllProducts(): void {
    this.http.get<IProduct[]>(`${environment.apiUrl}/products`).subscribe({
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
    shoeHeights: number[];
    prices: { min: number; max: number }[];
    colors: string[];
  }) {
    this.product_arr = this.product_arr_all.filter((p) => {
      const matchPrice =
        filter.prices.length === 0 ||
        filter.prices.some((r) => {
          const min = r.min ?? 0;
          const max = r.max ?? Infinity;
          return p.price_sale >= min && p.price_sale < max;
        });

      const matchCategory =
        filter.categories.length === 0 ||
        filter.categories.includes(Number(p.category_id));

      const matchBrand =
        filter.brands.length === 0 ||
        filter.brands.includes(Number(p.brand_id));

      const matchSize =
        filter.sizes.length === 0 ||
        p.variants?.some((variant) =>
          variant.product_variant_sizes?.some((vsize) =>
            filter.sizes.includes(vsize.size?.id)
          )
        );

      const matchGender =
        filter.genders.length === 0 ||
        filter.genders.includes(Number(p.gender_id));

      const matchShoeHeight =
        filter.shoeHeights.length === 0 ||
        p.variants?.some((v: any) =>
          filter.shoeHeights.includes(Number(v.shoe_height_id))
        );

      const matchColor =
        filter.colors.length === 0 ||
        p.variants?.some(
          (v) =>
            v.color?.color_name &&
            filter.colors.some((kw) =>
              v.color?.color_name.toLowerCase().includes(kw)
            )
        );

      console.log(p.variants.map((v) => v.color?.color_name));

      return (
        matchPrice &&
        matchCategory &&
        matchBrand &&
        matchSize &&
        matchGender &&
        matchShoeHeight &&
        matchColor
      );
    });

    console.log("Kết quả lọc:", this.product_arr);
  }
}
