import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { BannerComponent } from "../../components/banner/banner.component";
import { IBlog, IProduct } from "../../../core/models/structureData";
import { Router, RouterLink } from "@angular/router";
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
  blog_arr:IBlog[]=[];
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadNewestBlogs();
  }

  loadProducts() {
    fetch(`http://localhost:3000/api/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = (data as IProduct[]).slice(0, 8);
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm! ", error)
      );
  }
  loadNewestBlogs(){
    fetch(`http://localhost:3000/api/blogs/newest`)
    .then((res) => res.json())
    .then(data => {
      this.blog_arr = data;
    })
    .catch(err => {
      console.log('Loi khi fetch blog newest', err);
      
    })
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
