import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BannerComponent } from "../../components/banner/banner.component";
import { IProduct } from "../../../core/models/structureData";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild("scrollContainer", { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;

  // Data source (tách data ra cho sạch)
  sports = [
    { name: "Running", image: "images/nike-running.jpg" },
    { name: "Football", image: "images/nike-football.jpg" },
    { name: "Basketball", image: "images/nike-basketball.jpg" },
    { name: "Training and Gym", image: "images/nike-training-and-gym.jpg" },
    { name: "Tennis", image: "images/nike-tennis.jpg" },
    { name: "Yoga", image: "images/nike-yoga.jpg" },
    { name: "Skateboarding", image: "images/nike-skateboard.jpg" },
    { name: "Golf", image: "images/nike-dance.jpg" },
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

  product_arr: IProduct[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<IProduct[]>("http://localhost:3000/api/products").subscribe({
      next: (data) => {
        this.product_arr = data;
      },
      error: (error) => {
        console.error("Lỗi khi gọi API:", error);
      },
    });
  }

  // Like
  isLiked: boolean = false;

  toggleLike() {
    this.isLiked = !this.isLiked;
  }
}
