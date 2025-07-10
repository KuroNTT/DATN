import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  IProduct,
  IProductVariant,
  ISize,
} from "../../../core/models/structureData";
import { ActivatedRoute } from "@angular/router";
import { CartService } from "../../services/cart.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-product-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./product-detail.component.html",
  styleUrl: "./product-detail.component.css",
})
export class ProductDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}
  // Helper chung
  private extractSizes(variant: IProductVariant): ISize[] {
    return (variant.product_variant_sizes || []).map((pvs) => pvs.size);
  }

  /** ---------------- State hiển thị mô tả dài / ngắn ---------------- */
  showFullText = false;
  toggleShowText() {
    this.showFullText = !this.showFullText;
  }

  /** ---------------- Dữ liệu sản phẩm liên quan ---------------- */
  product_arr: IProduct[] = [];

  /** ---------------- Dữ liệu & state sản phẩm hiện tại ---------------- */
  slug: string = "";
  product: IProduct = {} as IProduct;
  product_variant_arr: IProductVariant[] = [];
  size_arr: ISize[] = [];

  selectedVariant: IProductVariant | null = null;
  selectedSize: ISize | null = null;
  quantity = 1; // có thể binding ra input number trong template

  /** ---------------- Hình ảnh ---------------- */
  imgList: string[] = [];
  mainImage: string = "";

  ngOnInit(): void {
    fetch(`http://localhost:3000/api/products/most-view/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = data as IProduct[];
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm nhiều lượt xem: ", error)
      );

    // Lắng nghe thay đổi của route param
    this.route.paramMap.subscribe((params) => {
      this.slug = String(params.get("slug"));
      this.loadProductDetail(this.slug);
    });
  }

  loadProductDetail(slug: string) {
    fetch(`http://localhost:3000/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        this.product = data.product as IProduct;

        /* --------- Biến thể & size --------- */
        this.product_variant_arr = this.product.variants;
        this.selectedVariant = this.product_variant_arr[0] ?? null;

        // ✅ Lấy size từ product_variant_sizes
        this.size_arr = this.selectedVariant
          ? this.extractSizes(this.selectedVariant)
          : [];
        this.selectedSize = null;

        if (this.product_variant_arr?.[0]?.images?.length > 0) {
          this.imgList = this.product_variant_arr[0].images.map(
            (img: any) => img.image_url
          );
          this.mainImage = this.imgList[0];
        }
      })
      .catch((error) => console.error("Có lỗi khi lấy sản phẩm: ", error));
  }

  onClick(img: string) {
    this.mainImage = img;
  }

  onSelectVariant(variant: IProductVariant) {
    this.selectedVariant = variant;

    this.size_arr = this.extractSizes(variant);
    this.selectedSize = null;

    this.imgList = variant.images?.map((img) => img.image_url) || [];
    this.mainImage = this.imgList[0] || "";

    console.log("🟦 Biến thể đã chọn:", {
      id: variant.id,
      style_code: variant.style_code,
      color: variant.color?.color_name,
    });
  }

  onSelectSize(size: ISize) {
    this.selectedSize = size;

    console.log("🟩 Size đã chọn:", {
      size_id: size.id,
      size: size.size,
      variant_id: this.selectedVariant?.id,
    });
  }

  addToCart() {
    if (!this.selectedVariant) {
      alert("⚠️ Vui lòng chọn biến thể (màu sắc) trước khi thêm vào giỏ hàng!");
      return;
    }

    if (!this.selectedSize) {
      alert("⚠️ Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return;
    }
    this.cartService.addToCart(
      this.selectedVariant.id,
      this.selectedSize.id,
      this.quantity
    );
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  }

  wishlist: IProductVariant[] = [];

  addToWishlist() {
    if (!this.selectedVariant) {
      alert("⚠️ Vui lòng chọn màu sắc (biến thể) để thêm vào yêu thích!");
      return;
    }

    alert(
      `❤️ Sản phẩm đã thêm vào danh sách yêu thích:\n` +
        `ID: ${this.selectedVariant.id}\n` +
        `Sản phẩm: ${this.product.name}\n` +
        `Mã biến thể: ${this.selectedVariant.style_code} - ${this.selectedVariant.color?.color_name}`
    );
  }
}
