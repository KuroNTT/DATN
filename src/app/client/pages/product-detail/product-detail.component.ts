import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-product-detail",
  imports: [CommonModule],
  templateUrl: "./product-detail.component.html",
  styleUrl: "./product-detail.component.css",
})
export class ProductDetailComponent {
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

  scrollLeft(slider: HTMLElement) {
    slider.scrollLeft -= 300;
  }

  scrollRight(slider: HTMLElement) {
    slider.scrollLeft += 300;
  }
}
