import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ProductService } from "../../../core/services/product.service";
import { IProduct, ICategory } from "../../../core/models/structureData";
import { CommonModule, NgClass } from "@angular/common";
import { ProductFilterComponent } from "../../components/product-filter/product-filter.component";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-search-result",
  imports: [CommonModule, RouterModule, ProductFilterComponent],
  templateUrl: "./search-result.component.html",
  styleUrls: ["./search-result.component.css"],
})
export class SearchResultComponent implements OnInit {
  searchQuery: string = "";
  searchResults: IProduct[] = [];

  product_arr: IProduct[] = [];
  product_arr_all: IProduct[] = [];
  category_arr: ICategory[] = [];

  constructor(
    private http: HttpClient,
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

  async fetchResults() {
    try {
      this.searchResults = await this.productService.searchProducts(
        this.searchQuery
      );
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
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
