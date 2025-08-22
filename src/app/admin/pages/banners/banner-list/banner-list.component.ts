import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { IBanner } from "../../../../core/models/structureData";
import { SwiperContainer } from "swiper/element";
import type { Swiper } from "swiper";
import { ElementRef } from "@angular/core";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-banner",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./banner-list.component.html",
  styleUrls: ["./banner-list.component.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BannerListComponent implements AfterViewInit {
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

            this.swiperInstance.update();
          }
        }, 0);
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu ảnh banner! ", error)
      );
  }

  onSwiperReady(swiper: any) {
    this.swiperInstance = swiper;
  }

  nextSlide() {
    console.log("Swiper instance:", this.swiperInstance);
    this.swiperInstance?.slideNext();
  }

  prevSlide() {
    this.swiperInstance?.slidePrev();
  }
}
