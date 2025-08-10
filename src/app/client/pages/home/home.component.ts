import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { BannerComponent } from "../../components/banner/banner.component";
import { IProduct } from "../../../core/models/structureData";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

import { IBlog } from "../../../core/models/structureData";
import { RouterLink } from "@angular/router";
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, BannerComponent, RouterLink],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("scrollContainer", { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;

  isLiked: boolean = false;
  product_arr: IProduct[] = [];
  blog_arr: IBlog[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadNewestBlogs();
  }

  loadProducts() {
    fetch(`${environment.apiUrl}/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = (data as IProduct[]).slice(0, 8);
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm! ", error)
      );
  }
  loadNewestBlogs() {
    fetch(`${environment.apiUrl}/blogs/newest`)
      .then((res) => res.json())
      .then((data) => {
        this.blog_arr = data;
      })
      .catch((err) => {
        console.log("Loi khi fetch blog newest", err);
      });
  }

  sports = [
    { categoryID: 3, name: "Chạy bộ", image: "images/nike-running.jpg" },
    { categoryID: 4, name: "Đá bóng", image: "images/nike-football.jpg" },
    { categoryID: 5, name: "Bóng rổ", image: "images/nike-basketball.jpg" },
    {
      categoryID: 6,
      name: "Tập luyện và Gym",
      image: "images/nike-training-and-gym.jpg",
    },
    { categoryID: 7, name: "Skateboard", image: "images/nike-skateboard.jpg" },
    { categoryID: 8, name: "Golf", image: "images/nike-golf.jpg" },
  ];

  goToCategory(categoryId: number) {
    this.router.navigate(["/product"], {
      queryParams: { category: categoryId },
    });
  }

  ngAfterViewInit(): void {}

  scrollRight() {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = 440 + 12;
    if (
      container.scrollLeft + container.clientWidth <
      container.scrollWidth - scrollAmount
    ) {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    } else {
      container.scrollTo({ left: 0, behavior: "smooth" });
    }
  }

  scrollLeft() {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = 440 + 12;

    if (container.scrollLeft > 0) {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    }
  }
}
