import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BrandService } from "../../../services/brand.service";
import { IBrand } from "../../../../core/models/structureData";
import Swal from "sweetalert2";
import { CommonModule } from "@angular/common";
import { BrandFormComponent } from "../components/brand-form/brand-form.component";

@Component({
  selector: "app-brand-add",
  imports: [CommonModule, BrandFormComponent],
  template: `<app-brand-form (save)="createBrand($event)"></app-brand-form>`,
})
export class BrandAddComponent {
  constructor(private brandService: BrandService, private router: Router) {}

  createBrand(brand: IBrand) {
    this.brandService.createBrand(brand).subscribe({
      next: () => {
        Swal.fire("Thành công", "Thêm thương hiệu thành công!", "success");
        this.router.navigate(["/admin/brands"]);
      },
      error: () => Swal.fire("Lỗi", "Không thể thêm thương hiệu", "error"),
    });
  }
}
