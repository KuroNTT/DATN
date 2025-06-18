import { Component } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
@Component({
  selector: "app-product",
  imports: [NgIf, NgClass],
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent {
  isPriceFilterVisible = true;
  isBrandFilterVisible = true;
  isSexFilterVisible = true;

  togglePriceFilter() {
    this.isPriceFilterVisible = !this.isPriceFilterVisible;
  }

  toggleBrandFilter() {
    this.isBrandFilterVisible = !this.isBrandFilterVisible;
  }
  toggleSexFilter() {
    this.isSexFilterVisible = !this.isSexFilterVisible;
  }
}
