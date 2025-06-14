import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BannerComponent } from "../../components/banner/banner.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild("scrollContainer") scrollContainer!: ElementRef<HTMLDivElement>;

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

  ngAfterViewInit() {
    console.log(
      "Scroll container initialized:",
      this.scrollContainer.nativeElement
    );
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -440,
      behavior: "smooth",
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 440,
      behavior: "smooth",
    });
  }
}
