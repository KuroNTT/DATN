import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { WishlistService } from "../../services/wishlist.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-favorite-button",
  imports: [CommonModule],
  standalone: true,
  templateUrl: "./favorite-button.component.html",
  styleUrls: ["./favorite-button.component.css"],
})
export class FavoriteButtonComponent {
  @Input() isFavorited: boolean | undefined = false;
  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router,
    private http: HttpClient
  ) {}
}
