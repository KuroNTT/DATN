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
import { ProductService } from "../../services/product.service";
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
  constructor(private router: Router, private pds: ProductService) {}

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
  // Data source (tách data ra cho sạch)
  sports = [
    { id: 3, name: "Chạy bộ", image: "images/nike-running.jpg" },
    { id: 4, name: "Đá bóng", image: "images/nike-football.jpg" },
    { id: 5, name: "Bóng rổ", image: "images/nike-basketball.jpg" },
    {
      id: 6,
      name: "Tập luyện và Gym",
      image: "images/nike-training-and-gym.jpg",
    },
    { id: 7, name: "Skateboard", image: "images/nike-skateboard.jpg" },
    { id: 8, name: "Golf", image: "images/nike-golf.jpg" },
  ];

  goToCategory(categoryId: number) {
    this.pds.setPreselectedCategory(categoryId);
    this.router.navigate(["/products"]);
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
