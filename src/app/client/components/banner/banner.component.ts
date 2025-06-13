import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-banner",
  imports: [CommonModule],
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class BannerComponent {
  slides = [
    {
      image: "/images/banner1.png",
      title: "Nike Air Max – Sự lựa chọn hoàn hảo",
    },
    {
      image: "/images/banner2.png",
      title: "Jordan Retro – Phong cách và thoải mái",
    },
    {
      image: "/images/banner3.png",
      title: "Khám phá BST 2025 mới nhất",
    },
  ];
}
