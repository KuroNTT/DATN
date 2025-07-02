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
    },
    {
      image: "/images/banner2.png",
    },
    {
      image: "/images/banner3.png",
    },
  ];
}
