import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { BannerComponent } from "../../components/banner/banner.component";
import { FavoriteButtonComponent } from "../../components/favorite-button/favorite-button.component";
import { IProduct } from "../../../core/models/structureData";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { WishlistService } from "../../services/wishlist.service";
// demo
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, BannerComponent, FavoriteButtonComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  @ViewChild("scrollContainer", { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;
  isLiked: boolean = false;
  product_arr: IProduct[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private wishlistService: WishlistService
  ) {}

  loadProducts(): Promise<void> {
    return fetch(`http://localhost:3000/api/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = (data as IProduct[]).slice(0, 8);
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm! ", error)
      );
  }
  ngOnInit(): void {
    const user = this.authService.getUser();
    // 1. Load sản phẩm trước
    this.loadProducts()
      .then(() => {
        // 2. Nếu có user đăng nhập thì gọi API lấy sản phẩm yêu thích
        if (user) {
          this.wishlistService.getFavoritesByUser(user.id).subscribe({
            next: (res) => {
              const favoritedIds: number[] = res.productIds;
              // 3. Gán trạng thái isFavorited = true cho từng sản phẩm
              this.product_arr = this.product_arr.map((product) => ({
                ...product,
                isFavorited: favoritedIds.includes(product.id),
              }));
            },
            error: (err) => {
              console.error("❌ Lỗi khi lấy danh sách yêu thích:", err);
            },
          });
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi load sản phẩm:", err);
      });
  }

  // Data source (tách data ra cho sạch)
  sports = [
    { name: "Running", image: "images/nike-running.jpg" },
    { name: "Football", image: "images/nike-football.jpg" },
    { name: "Basketball", image: "images/nike-basketball.jpg" },
    { name: "Training and Gym", image: "images/nike-training-and-gym.jpg" },
    { name: "Skateboarding", image: "images/nike-skateboard.jpg" },
    { name: "Golf", image: "images/nike-golf.jpg" },
  ];

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
