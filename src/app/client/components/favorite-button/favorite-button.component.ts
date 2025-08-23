import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";
import { WishlistService } from "../../services/wishlist.service";
import { ProductService } from "../../services/product.service";
import { IWishlist } from "../../../core/models/structureData";

import { Router } from "@angular/router";
import { EventEmitter, Output } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-favorite-button",
  imports: [CommonModule],
  standalone: true,
  templateUrl: "./favorite-button.component.html",
  styleUrls: ["./favorite-button.component.css"],
})
export class FavoriteButtonComponent {
  @Input() productId!: number;
  @Input() size!: number;
  @Input() variantId!: number;
  @Input() isFavorited: boolean | undefined = false;
  @Output() favoriteToggled = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router,
    private http: HttpClient
  ) {}
}
