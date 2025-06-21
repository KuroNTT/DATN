import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IProduct } from "../../../core/models/structureData";
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
  imgList: string[] = [
    "images/img-giay.png",
    "images/img-giay2.png",
    "images/img-giay3.png",
    "images/img-giay4.png",
    "images/img-giay5.png",
    "images/img-giay6.png",
    "images/img-giay7.png",
    "images/img-giay.png",
  ];

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
  product: IProduct = {} as IProduct;

  ngOnInit(): void {
    fetch(`http://localhost:3000/api/most-view-product/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = data as IProduct[];
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm nhiều lượt xem: ", error)
      );

    this.id = Number(this.route.snapshot.paramMap.get("id"));
    fetch(`http://localhost:3000/api/product/${this.id}`)
      .then((res) => res.json())
      .then((data) => {
        this.product = data.product as IProduct;
      })
      .catch((error) => console.error("Có lỗi khi lấy sản phẩm: ", error));
  }
}
