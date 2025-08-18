import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../../services/product.service";
import { IProduct } from "../../../../core/models/structureData";
import { ProductFormComponent } from "../components/product-form/product-form.component";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-product-edit",
  template: `
    <app-product-form
      *ngIf="product"
      [formData]="product"
      [isEditMode]="true"
      (submitForm)="updateProduct($event)"
    />
  `,
  standalone: true,
  imports: [ProductFormComponent, CommonModule],
})
export class ProductEditComponent implements OnInit {
  product!: IProduct;
  slug = "";

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get("slug") || "";
    if (this.slug) {
      this.productService.getOne(this.slug).subscribe((res) => {
        this.product = res;
      });
    }
  }

  updateProduct(updatedData: IProduct) {
    this.productService.updateBySlug(this.slug, updatedData).subscribe({
      next: () => {
        alert("Cập nhật thành công!");
        this.router.navigate(["admin/products"]);
      },
      error: () => alert("Lỗi khi cập nhật!"),
    });
  }
}
