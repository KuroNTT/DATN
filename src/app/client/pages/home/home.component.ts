import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { BannerComponent } from "../../components/banner/banner.component";
import { IProduct, IBlog, IVoucher } from "../../../core/models/structureData";
import { Router, RouterLink } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { ProductService } from "../../services/product.service";
import { VoucherService } from "../../services/voucher.service";
import { AuthService } from "../../services/auth.service";
import { WishlistService } from "../../services/wishlist.service";
import { FavoriteButtonComponent } from "../../components/favorite-button/favorite-button.component";
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, BannerComponent, FavoriteButtonComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  @ViewChild("scrollContainer", { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;

  @ViewChild("swiperRef") swiperRef?: ElementRef;
  swiperInstance: any = null;

  isLiked: boolean = false;
  product_arr: IProduct[] = [];
  blog_arr: IBlog[] = [];
  vouchers: IVoucher[] = [];

  constructor(
    private router: Router,
    private pds: ProductService,
    private voucherService: VoucherService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadNewestBlogs();
    this.loadVouchers();
  }

  ngAfterViewInit(): void {}

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
  // Minh - yêu thích
  // ngOnInit(): void {
  //   const user = this.authService.getUser();
  //   // 1. Load sản phẩm trước
  //   this.loadProducts()
  //     .then(() => {
  //       // 2. Nếu có user đăng nhập thì gọi API lấy sản phẩm yêu thích
  //       if (user) {
  //         this.wishlistService.getFavoritesByUser(user.id).subscribe({
  //           next: (res) => {
  //             const favoritedIds: number[] = res.productIds;
  //             // 3. Gán trạng thái isFavorited = true cho từng sản phẩm
  //             this.product_arr = this.product_arr.map((product) => ({
  //               ...product,
  //               isFavorited: favoritedIds.includes(product.id),
  //             }));
  //           },
  //           error: (err) => {
  //             console.error("❌ Lỗi khi lấy danh sách yêu thích:", err);
  //           },
  //         });
  //       }

  loadNewestBlogs() {
    fetch(`${environment.apiUrl}/blogs/newest`)
      .then((res) => res.json())
      .then((data) => {
        this.blog_arr = data;
      })
      .catch((err) => {
        console.error("❌ Lỗi khi load sản phẩm:", err);
      });
  }

  loadVouchers() {
    this.voucherService.getUserVouchers().subscribe({
      next: (data: IVoucher[]) => {
        this.vouchers = data;
        setTimeout(() => {
          const swiperEl = this.swiperRef?.nativeElement as any;
          if (swiperEl?.swiper) {
            this.swiperInstance = swiperEl.swiper;
            this.swiperInstance.update();
          }
        }, 0);
      },
      error: (err) => {
        console.error("Lỗi khi load voucher:", err);
      },
    });
  }
  get latestVouchers() {
    return this.vouchers.slice(0, 3);
  }

  onSwiperReady(swiper: any) {
    this.swiperInstance = swiper;
  }

  // Các hàm scroll giữ nguyên
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
