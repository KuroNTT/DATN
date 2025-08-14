import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule, NgClass, NgFor } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import {
  ICategory,
  IBrand,
  ISize,
  IGender,
  IColor,
  IShoeHeight,
} from "../../../core/models/structureData";
import { environment } from "../../../../enviroments/environment";
import { ProductService } from "../../services/product.service";
@Component({
  selector: "app-product-filter",
  standalone: true,
  imports: [NgClass, NgFor, FormsModule, CommonModule],
  templateUrl: "./product-filter.component.html",
  styleUrl: "./product-filter.component.css",
})
export class ProductFilterComponent {
  category_arr: ICategory[] = [];
  brand_arr: IBrand[] = [];
  gender_arr: IGender[] = [];
  size_arr: (ISize & { checked?: boolean })[] = [];
  shoe_height_arr: (IShoeHeight & { checked?: boolean })[] = [];

  selectAllPrices: boolean = false;
  selectAllCategory: boolean = false;
  selectAllBrands: boolean = false;
  selectAllSizes: boolean = false;
  selectAllGenders: boolean = false;
  selectAllShoeHeight: boolean = false;
  selectAllColors: boolean = false;

  @Output() filterChanged = new EventEmitter<{
    categories: number[];
    brands: number[];
    sizes: number[];
    genders: number[];
    shoeHeights: number[];
    colors: string[];
    prices: { min: number; max: number }[];
  }>();

  price_ranges = [
    {
      id: 1,
      name: "Trên 1 triệu",
      min: 1000000,
      max: Number.MAX_SAFE_INTEGER,
      checked: false,
    },
    {
      id: 2,
      name: "Từ 1tr5 tới 2tr5",
      min: 1500000,
      max: 2500000,
      checked: false,
    },
    {
      id: 3,
      name: "Từ 2tr tới 3tr",
      min: 2000000,
      max: 3000000,
      checked: false,
    },
    {
      id: 4,
      name: "Từ 3tr tới 4tr5",
      min: 3000000,
      max: 4500000,
      checked: false,
    },
    {
      id: 5,
      name: "Trên 5 triệu",
      min: 5000000,
      max: Number.MAX_SAFE_INTEGER,
      checked: false,
    },
  ];

  color_arr: {
    id: number;
    color_name: string;
    keyword: string;
    hex: string;
    checked: boolean;
  }[] = [
    {
      id: 1,
      color_name: "Đen",
      keyword: "Đen",
      hex: "#000000",
      checked: false,
    },
    {
      id: 2,
      color_name: "Trắng",
      keyword: "Trắng",
      hex: "#ffffff",
      checked: false,
    },
    { id: 3, color_name: "Đỏ", keyword: "Đỏ", hex: "#ff0000", checked: false },
    {
      id: 4,
      color_name: "Xám",
      keyword: "Xám",
      hex: "#808080",
      checked: false,
    },
    {
      id: 5,
      color_name: "Xanh",
      keyword: "Xanh dương",
      hex: "#0000ff",
      checked: false,
    },
    {
      id: 6,
      color_name: "Vàng",
      keyword: "Vàng",
      hex: "#ffff00",
      checked: false,
    },
    {
      id: 7,
      color_name: "Xám",
      keyword: "xám",
      hex: "#808080",
      checked: false,
    },
  ];

  constructor(private http: HttpClient, private pds: ProductService) {}
  ngOnInit(): void {
    this.http.get<ICategory[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (data) => {
        this.category_arr = data;
        const preId = this.pds.getPreselectedCategory();
  if (preId) {
    const found = this.category_arr.find(c => c.id === preId);
    if (found) {
      found.checked = true;
      this.selectAllCategory = false;
      this.emitFilter();
      this.pds.clearPreselectedCategory();
    }
  }
      },
      error: (error) => {
        console.error("Lỗi khi lấy categories:", error);
      },
    });

    this.http.get<IBrand[]>(`${environment.apiUrl}/brands`).subscribe({
      next: (data) => {
        this.brand_arr = data;        
      },
      error: (error) => {
        console.error("Lỗi khi lấy brands:", error);
      },
    });

    this.http.get<ISize[]>(`${environment.apiUrl}/sizes`).subscribe({
      next: (data) => {
        this.size_arr = data;
      },
      error: (error) => {
        console.error("Lỗi khi lấy sizes:", error);
      },
    });

    this.http.get<IGender[]>(`${environment.apiUrl}/genders`).subscribe({
      next: (data) => {
        this.gender_arr = data;
      },
      error: (error) => {
        console.error("Lỗi khi lấy genders:", error);
      },
    });

    this.http
      .get<IShoeHeight[]>(`${environment.apiUrl}/shoe_heights`)
      .subscribe({
        next: (data) => {
          this.shoe_height_arr = data;
        },
        error: (error) => {
          console.error("Lỗi khi lấy shoe_heights:", error);
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
    const selectedGenders = this.gender_arr
      .filter((g) => g.checked)
      .map((g) => g.id);
    const selectedShoeHeights = this.shoe_height_arr
      .filter((h) => h.checked)
      .map((h) => h.id);
    const selectedPriceRanges = this.price_ranges
      .filter((p) => p.checked)
      .map((p) => ({ min: p.min, max: p.max }));
    const selectedColors = this.color_arr
      .filter((color) => color.checked)
      .map((color) => color.keyword.toLowerCase());

    this.filterChanged.emit({
      categories: selectedCategories,
      brands: selectedBrands,
      sizes: selectedSizes,
      genders: selectedGenders,
      prices: selectedPriceRanges,
      shoeHeights: selectedShoeHeights,
      colors: selectedColors,
    });
  }

  onPriceChange(range: any, event: Event): void {
    range.checked = (event.target as HTMLInputElement).checked;
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
    if (this.selectAllGenders) {
      this.gender_arr.forEach((g) => (g.checked = false));
    }
    this.emitFilter();
  }

  // hàm chọn tất cả hay bỏ giới tính
  onGenderChange(): void {
    const anyGenderChecked = this.gender_arr.some((g) => g.checked);
    if (anyGenderChecked) {
      this.selectAllGenders = false;
    }
    this.emitFilter();
  }

  onSelectAllShoeHeights(): void {
    if (this.selectAllShoeHeight) {
      this.shoe_height_arr.forEach((h) => (h.checked = false));
    }
    this.emitFilter();
  }

  onShoeHeightChange(): void {
    const anyChecked = this.shoe_height_arr.some((h) => h.checked);
    if (anyChecked) {
      this.selectAllShoeHeight = false;
    }
    this.emitFilter();
  }

  onColorChange(color: any): void {
    const anyColorChecked = this.color_arr.some((c) => c.checked);
    if (anyColorChecked) {
      this.selectAllColors = false;
    }
    this.emitFilter();
  }

  onSelectAllColors(): void {
    if (this.selectAllColors) {
      this.color_arr.forEach((c) => (c.checked = false));
    }
    this.emitFilter();
  }

  isPriceFilterVisible = false;
  isCategoryFilterVisible = false;
  isBrandFilterVisible = false;
  isGenderFilterVisible = false;
  isSizeFilterVisible = false;
  isShoeHeightFilterVisible = false;
  isColorFilterVisible = false;

  togglePriceFilter() {
    this.isPriceFilterVisible = !this.isPriceFilterVisible;
  }
  toggleCategoryFilter() {
    this.isCategoryFilterVisible = !this.isCategoryFilterVisible;
  }
  toggleBrandFilter() {
    this.isBrandFilterVisible = !this.isBrandFilterVisible;
  }
  toggleSizeFilter() {
    this.isSizeFilterVisible = !this.isSizeFilterVisible;
  }
  toggleGenderFilter() {
    this.isGenderFilterVisible = !this.isGenderFilterVisible;
  }
  toggleShoeHeightFilter() {
    this.isShoeHeightFilterVisible = !this.isShoeHeightFilterVisible;
  }
  toggleColorFilter() {
    this.isColorFilterVisible = !this.isColorFilterVisible;
  }

  get selectedCategoryCount(): number {
    return this.category_arr.filter((c) => c.checked).length;
  }

  get selectedBrandCount(): number {
    return this.brand_arr.filter((b) => b.checked).length;
  }

  get selectedSizeCount(): number {
    return this.size_arr.filter((s) => s.checked).length;
  }

  get selectedGenderCount(): number {
    return this.gender_arr.filter((g) => g.checked).length;
  }

  get selectedShoeHeightCount(): number {
    return this.shoe_height_arr.filter((h) => h.checked).length;
  }

  get selectedPriceCount(): number {
    return this.price_ranges.filter((p) => p.checked).length;
  }
  get selectedColorCount(): number {
    return this.color_arr.filter((color) => color.checked).length;
  }

  toggleAllSizes(): void {
    this.selectAllSizes = !this.selectAllSizes;
    if (this.selectAllSizes) {
      this.size_arr.forEach((s) => (s.checked = false));
    }
    this.emitFilter();
  }

  toggleSize(size: ISize & { checked?: boolean }): void {
    size.checked = !size.checked;
    this.selectAllSizes = false;
    this.emitFilter();
  }
}
