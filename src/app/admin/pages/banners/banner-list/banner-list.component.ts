import { Component, OnInit } from "@angular/core";
import { BannerService } from "../../../services/banner.service";
import { IBanner } from "../../../../core/models/structureData";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-banner-list",
  templateUrl: "./banner-list.component.html",
  styleUrls: ["./banner-list.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class BannerListComponent implements OnInit {
  banners: IBanner[] = [];

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.bannerService.getAll().subscribe((data) => {
      this.banners = data;
    });
  }
}
