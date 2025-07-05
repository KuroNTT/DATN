import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule, NgClass, NgFor } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import {
  ICategory,
  IBrand,
  ISize,
  IGender,
  IPrice_ranges,
} from "../../../../../core/models/structureData";

@Component({
  selector: "app-product-filter",
  standalone: true,
  imports: [NgClass, NgFor, FormsModule],
  templateUrl: "./product-filter.component.html",
  styleUrl: "./product-filter.component.css",
})
export class ProductFilterComponent {
  category_arr: ICategory[] = [];
  brand_arr: IBrand[] = [];
  gender_arr: IGender[] = [];
  size_arr: (ISize & { checked?: boolean })[] = [];
  price_ranges: IPrice_ranges[] = [];
  selectAllPrices: boolean = false;
  selectAllCategory: boolean = false;
  selectAllBrands: boolean = false;
  selectAllSizes: boolean = false;
  selectAllGenders: boolean = false;

  @Output() filterChanged = new EventEmitter<{
    categories: number[];
    brands: number[];
    sizes: number[];
    genders: number[];
    prices: { min: number; max: number }[];
  }>();

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http
      .get<IPrice_ranges[]>("http://localhost:3000/api/price_ranges")
      .subscribe({
        next: (data) => {
          this.price_ranges = data;
        },
        error: (error) => {
          console.error("Lỗi khi lấy price_ranges:", error);
        },
      });
    this.http
      .get<ICategory[]>("http://localhost:3000/api/categories")
      .subscribe({
        next: (data) => {
          this.category_arr = data;
        },
        error: (error) => {
          console.error("Lỗi khi lấy categories:", error);
        },
      });
    this.http.get<IBrand[]>("http://localhost:3000/api/brands").subscribe({
      next: (data) => {
        this.brand_arr = data;
      },
      error: (error) => {
        console.error("Lỗi khi lấy brands:", error);
      },
    });
    this.http.get<ISize[]>("http://localhost:3000/api/sizes").subscribe({
      next: (data) => {
        this.size_arr = data;
      },
      error: (error) => {
        console.error("Lỗi khi lấy sizes:", error);
      },
    });
    this.http.get<IGender[]>("http://localhost:3000/api/genders").subscribe({
      next: (data) => {
        this.gender_arr = data;
      },
      error: (error) => {
        console.error("Lỗi khi lấy genders:", error);
      },
    });
  }
  emitFilter() {
    const selectedCategories = this.category_arr
      .filter((c) => c.checked)
      .map((c) => c.id);
    const selectedBrands = this.brand_arr
      .filter((b) => b.checked)
      .map((b) => b.id);
    const selectedSizes = this.size_arr
      .filter((s) => s.checked)
      .map((s) => s.id);
    const selectedPriceRanges = this.price_ranges
      .filter((p) => p.checked)
      .map((p) => ({ min: p.min, max: p.max }));
    // console.log("Selected Categories:", selectedCategories);
    // console.log("Selected Brands:", selectedBrands);
    // console.log("Selected Sizes:", selectedSizes);

    this.filterChanged.emit({
      categories: selectedCategories,
      brands: selectedBrands,
      sizes: selectedSizes,
      genders: selectedSizes,
      prices: selectedPriceRanges,
    });
  }
  // test
  onSelectAllPrices(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectAllPrices = input.checked;

    if (this.selectAllPrices) {
      this.price_ranges.forEach((r) => (r.checked = false));
    }

    this.emitFilter();
  }

  onPriceChange(range: IPrice_ranges, event: Event): void {
    range.checked = (event.target as HTMLInputElement).checked;
    this.selectAllPrices = false;
    this.emitFilter();
  }

  // hàm chọn tất cả hay bỏ loại
  onSelectAllBrands(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectAllBrands = input.checked;
    if (this.selectAllBrands) {
      this.brand_arr.forEach((b) => (b.checked = false));
    }
    this.emitFilter();
  }

  onBrandChange(brand: IBrand, event: Event): void {
    brand.checked = (event.target as HTMLInputElement).checked;
    this.selectAllBrands = false;
    this.emitFilter();
  }
  // hàm chọn tất cả hay bỏ loại
  onSelectAllCategories(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectAllCategory = input.checked;

    if (this.selectAllCategory) {
      this.category_arr.forEach((c) => (c.checked = false));
    }

    this.emitFilter();
  }

  onCategoryChange(category: ICategory, event: Event): void {
    category.checked = (event.target as HTMLInputElement).checked;
    this.selectAllCategory = false;
    this.emitFilter();
  }
  // hàm chọn tất cả hay bỏ size
  onSelectAllSizes(): void {
    if (this.selectAllSizes) {
      // Huỷ tất cả size cụ thể khi chọn "Tất cả"
      this.size_arr.forEach((s) => (s.checked = false));
    }
    this.emitFilter();
  }

  onSizeChange(): void {
    // Nếu chọn 1 hoặc nhiều size cụ thể → huỷ chọn "Tất cả"
    const anySizeChecked = this.size_arr.some((s) => s.checked);
    if (anySizeChecked) {
      this.selectAllSizes = false;
    }
    this.emitFilter();
  }

  // hàm chọn tất cả hay bỏ size
  onSelectAllGenders(): void {
    if (this.selectAllSizes) {
      // Huỷ tất cả size cụ thể khi chọn "Tất cả"
      this.gender_arr.forEach((s) => (s.checked = false));
    }
    this.emitFilter();
  }
  // hàm chọn tất cả hay bỏ giới tính
  onGenderChange(): void {
    // Nếu chọn 1 hoặc nhiều size cụ thể → huỷ chọn "Tất cả"
    const anySizeChecked = this.gender_arr.some((s) => s.checked);
    if (anySizeChecked) {
      this.selectAllSizes = false;
    }
    this.emitFilter();
  }
  // test

  // hiệu ứng thu + phóng
  isPriceFilterVisible = true;
  isCategoryFilterVisible = true;
  isBrandFilterVisible = true;
  isGenderFilterVisible = true;
  isSizeFilterVisible = true;

  togglePriceFilter() {
    this.isPriceFilterVisible = !this.isPriceFilterVisible;
  }
  toggleCategoryFilter() {
    console.log("minh");
    this.isCategoryFilterVisible = !this.isCategoryFilterVisible;
  }
  toggleBrandFilter() {
    this.isBrandFilterVisible = !this.isBrandFilterVisible;
  }
  toggleGenderFilter() {
    this.isGenderFilterVisible = !this.isGenderFilterVisible;
  }
  toggleSizeFilter() {
    this.isSizeFilterVisible = !this.isSizeFilterVisible;
  }
}
