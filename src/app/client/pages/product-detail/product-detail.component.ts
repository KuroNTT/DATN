import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  IProduct,
  IProductImage,
  IProductVariant,
} from "../../../core/models/structureData";
import { HttpClient } from "@angular/common/http";
import { routes } from "../../../app.routes";
import { ActivatedRoute } from "@angular/router";
import { error } from "console";

@Component({
  selector: "app-product-detail",
  imports: [CommonModule],
  templateUrl: "./product-detail.component.html",
  styleUrl: "./product-detail.component.css",
})
export class ProductDetailComponent {
  constructor(private route: ActivatedRoute) {}
  imgList: string[] = ["images/img-giay.png"];

  mainImage: string = this.imgList[0];

  onHover(img: string) {
    this.mainImage = img;
  }
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

  ngOnInit(): void {
    fetch(`http://localhost:3000/api/products/most-view/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = data as IProduct[];
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm nhiều lượt xem: ", error)
      );

    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.slug = String(this.route.snapshot.paramMap.get("slug"));
    fetch(`http://localhost:3000/api/products/${this.slug}`)
      .then((res) => res.json())
      .then((data) => {
        this.product = data.product as IProduct;
        this.product_variant_arr = this.product.variants;
        console.log("Variants:", this.product_variant_arr);
      })
      .catch((error) => console.error("Có lỗi khi lấy sản phẩm: ", error));
  }
}
