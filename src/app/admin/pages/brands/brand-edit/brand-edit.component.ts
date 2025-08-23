import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IBrand } from "../../../../core/models/structureData";
import { BrandService } from "../../../services/brand.service";
import Swal from "sweetalert2";
import { CommonModule } from "@angular/common";
import { BrandFormComponent } from "../components/brand-form/brand-form.component";

@Component({
  selector: "app-brand-edit",
  standalone: true,
  imports: [CommonModule, BrandFormComponent],
  template: `
    <app-brand-form *ngIf="brand" [brand]="brand" (save)="updateBrand($event)">
    </app-brand-form>
  `,
})
export class BrandEditComponent implements OnInit {
  brand: IBrand | null = null;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private brandService: BrandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.brandService.getBrandById(this.id).subscribe({
      next: (data) => (this.brand = data),
      error: () => Swal.fire("Lỗi", "Không tìm thấy thương hiệu", "error"),
    });
  }

  updateBrand(updated: IBrand) {
    this.brandService.updateBrand(this.id, updated).subscribe({
      next: () => {
        Swal.fire("Thành công", "Cập nhật thương hiệu thành công!", "success");
        this.router.navigate(["/admin/brands"]);
      },
      error: () => Swal.fire("Lỗi", "Không thể cập nhật thương hiệu", "error"),
    });
  }
}
