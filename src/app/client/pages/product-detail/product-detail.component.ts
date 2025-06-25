import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  IProduct,
  IProductImage,
  IProductVariant,
  ISize,
} from "../../../core/models/structureData";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-product-detail",
  imports: [CommonModule],
  templateUrl: "./product-detail.component.html",
  styleUrl: "./product-detail.component.css",
})
export class ProductDetailComponent {
  constructor(private route: ActivatedRoute) {}
  showFullText = false;

  toggleShowText() {
    this.showFullText = !this.showFullText;
  }

  product_arr: IProduct[] = [];
  id: number = 0;
  slug: string = "";
  product: IProduct = {} as IProduct;
  product_variant_arr: IProductVariant[] = [];
  variant_image_arr: IProductImage[] = [];
  size_arr: ISize[] = [];

  selectedVariant: IProductVariant | null = null;
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

    this.slug = String(this.route.snapshot.paramMap.get("slug"));

    fetch(`http://localhost:3000/api/products/${this.slug}`)
      .then((res) => res.json())
      .then((data) => {
        this.product = data.product;
        this.product_variant_arr = this.product.variants;
        this.selectedVariant = this.product_variant_arr[0];

        if (this.product_variant_arr?.[0]?.images?.length > 0) {
          this.imgList = this.product_variant_arr[0].images.map(
            (img: any) => img.image_url
          );
          this.mainImage = this.imgList[0];
        }
      })
      .catch((error) => console.error("Có lỗi khi lấy sản phẩm: ", error));

    fetch(`http://localhost:3000/api/sizes`)
      .then((res) => res.json())
      .then((data) => (this.size_arr = data as ISize[]))
      .catch((error) => console.error("Có lỗi khi lấy dữ liệu size! ", error));
  }

  onClick(img: string) {
    this.mainImage = img;
  }

  onSelectVariant(variant: IProductVariant) {
    this.selectedVariant = variant;
    this.imgList = variant.images?.map((img) => img.image_url) || [];
    this.mainImage = this.imgList[0] || "";
  }
}
