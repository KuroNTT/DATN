import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { IBanner } from "../../../core/models/structureData";
import { SwiperContainer } from "swiper/element";
import type { Swiper } from "swiper";
import { ElementRef } from "@angular/core";
import { environment } from "../../../../enviroments/environment";

@Component({
  selector: "app-banner",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BannerComponent implements AfterViewInit {
  @ViewChild("swiperRef") swiperRef?: ElementRef;

  slide_arr: IBanner[] = [];
  swiperInstance: any = null;

  ngOnInit(): void {
    this.loadBanners();
  }

  ngAfterViewInit() {}

  loadBanners() {
    fetch(`${environment.apiUrl}/admin/banners`)
      .then((res) => res.json())
      .then((data) => {
        this.slide_arr = data as IBanner[];

        setTimeout(() => {
          const swiperEl = this.swiperRef?.nativeElement as any;

          if (swiperEl?.swiper) {
            this.swiperInstance = swiperEl.swiper;
            console.log("✅ Swiper instance ready", this.swiperInstance);

            // 👉 Quan trọng: gọi update() để Swiper re-render
            this.swiperInstance.update();
          }
        }, 0); // Chờ Angular render xong slide *ngFor
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu ảnh banner! ", error)
      );
  }

  onSwiperReady(swiper: any) {
    this.swiperInstance = swiper;
    console.log("✅ Swiper initialized!", swiper);
  }

  nextSlide() {
    console.log("Swiper instance:", this.swiperInstance);
    this.swiperInstance?.slideNext();
  }

  prevSlide() {
    this.swiperInstance?.slidePrev();
  }
}
