import { Component, OnInit } from "@angular/core";
import { ProductFilterComponent } from "../../components/product-filter/product-filter.component";
import { ProductListComponent } from "../product-list/product-list.component";
import { IProduct } from "../../../core/models/structureData";
import { NgxPaginationModule } from "ngx-pagination";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { ActivatedRoute, Router } from "@angular/router";

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
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  product_arr: IProduct[] = [];
  p: number = 1;
  loading = false;

  ngOnInit(): void {
    const url = this.router.url;

    if (url.startsWith("/new-products")) {
      this.getNewProducts();
      return;
    }

    if (url.startsWith("/featured")) {
      this.getMostViewedProducts();
      return;
    }

    this.route.queryParams.subscribe((params) => {
      // Lọc theo giới tính
      if (params["gender_id"] || params["genders"]) {
        const genderValue = params["genders"] ?? params["gender_id"];
        const genders = Array.isArray(genderValue)
          ? genderValue.join(",")
          : String(genderValue);
        this.getProducts({ genders });
        return;
      }

      // Lọc theo hãng
      if (params["brands"]) {
        const brandValue = Array.isArray(params["brands"])
          ? params["brands"].join(",")
          : String(params["brands"]);

        this.getProducts({ brands: brandValue });
        return;
      }

      // Lọc theo danh mục
      if (params["category"]) {
        const catId = Array.isArray(params["category"])
          ? params["category"][0]
          : params["category"];

        this.getProductsByCategory(catId);
        return;
      }
      // Lọc theo size test
      if (params["sizes"] || params["size"]) {
        const sizeValue = params["sizes"] ?? params["size"];
        const sizes = Array.isArray(sizeValue)
          ? sizeValue.join(",")
          : String(sizeValue);
        console.log("[FE] queryParams -> sizes:", sizes);
        this.getProducts({ sizes });
        return;
      }
      // lấy hết sp
      this.fetchAllProducts();
    });
  }

  private getProducts(paramsObj: Record<string, string>): void {
    this.http
      .get<IProduct[]>(`${environment.apiUrl}/products`, { params: paramsObj })
      .subscribe({
        next: (data) => (this.product_arr = data),
        error: (err) => console.error("❌ Lỗi khi lọc sản phẩm:", err),
      });
  }

  private getProductsByCategory(catId: string): void {
    this.http
      .get<IProduct[]>(
        `${environment.apiUrl}/products/by-category/${encodeURIComponent(
          catId
        )}`
      )
      .subscribe({
        next: (data) => (this.product_arr = data),
        error: (err) => console.error("❌ Lỗi khi lọc theo category:", err),
      });
  }
  // lấy sản phẩm mới
  private getNewProducts(): void {
    this.http
      .get<IProduct[]>(`${environment.apiUrl}/products/new/10`)
      .subscribe({
        next: (d) => (this.product_arr = d),
        error: (e) => console.error("❌ Lỗi lấy sản phẩm mới:", e),
      });
  }
  //  lấy sản phẩm view nhiều
  private getMostViewedProducts(): void {
    this.http
      .get<IProduct[]>(`${environment.apiUrl}/products/most-view/20`)
      .subscribe({
        next: (d) => (this.product_arr = d),
        error: (e) => console.error("❌ Lỗi lấy sản phẩm xem nhiều:", e),
      });
  }

  /** Lấy toàn bộ sản phẩm */
  fetchAllProducts(): void {
    this.loading = true;
    this.http.get<IProduct[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => {
        this.product_arr = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Lỗi khi lấy tất cả sản phẩm:", err);
        this.loading = false;
      },
    });
  }

  /** Tạo HttpParams từ filter object */
  private buildParams(filter: {
    categories: number[];
    brands: number[];
    sizes: number[];
    genders: number[];
    shoeHeights: number[];
    prices: { min: number; max: number }[];
    colors: string[];
  }): HttpParams {
    let params = new HttpParams();

    const joinNums = (arr: number[]) => arr.join(",");
    const joinColors = (arr: string[]) =>
      arr.map((s) => s.toLowerCase()).join(",");
    const joinPrices = (prs: { min: number; max: number }[]) =>
      prs
        .map((p) => `${p.min}-${Number.isFinite(p.max) ? p.max : ""}`)
        .join(",");

    if (filter.categories?.length)
      params = params.set("categories", joinNums(filter.categories));
    if (filter.brands?.length)
      params = params.set("brands", joinNums(filter.brands));
    if (filter.sizes?.length)
      params = params.set("sizes", joinNums(filter.sizes));
    if (filter.genders?.length)
      params = params.set("genders", joinNums(filter.genders));
    if (filter.shoeHeights?.length)
      params = params.set("collars", joinNums(filter.shoeHeights));
    if (filter.colors?.length)
      params = params.set("colors", joinColors(filter.colors));
    if (filter.prices?.length)
      params = params.set("prices", joinPrices(filter.prices));

    return params;
  }

  /** Khi bộ lọc thay đổi từ ProductFilterComponent */
  onFilterChanged(filter: {
    categories: number[];
    brands: number[];
    sizes: number[];
    genders: number[];
    shoeHeights: number[];
    prices: { min: number; max: number }[];
    colors: string[];
  }) {
    this.p = 1; // Reset về trang 1
    this.loading = true;

    const params = this.buildParams(filter);

    this.http
      .get<IProduct[]>(`${environment.apiUrl}/products`, { params })
      .subscribe({
        next: (data) => {
          this.product_arr = data;
          this.loading = false;
        },
        error: (err) => {
          console.error("Lỗi khi lọc sản phẩm:", err);
          this.loading = false;
        },
      });
  }
}
