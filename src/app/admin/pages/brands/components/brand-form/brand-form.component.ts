import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BrandService } from "../../../../services/brand.service";
import { IBrand } from "../../../../../core/models/structureData";
import Swal from "sweetalert2";

@Component({
  selector: "app-brand-form",
  templateUrl: "./brand-form.component.html",
  styleUrls: ["./brand-form.component.css"],
})
export class BrandFormComponent implements OnInit {
  @Input() brand: IBrand | null = null;
  @Output() save = new EventEmitter<IBrand>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.brand?.name || "", Validators.required],
      description: [this.brand?.description || ""],
      status: [this.brand?.status ?? 1, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ tên thương hiệu!",
        confirmButtonText: "OK",
      });
      return;
    }

    this.save.emit(this.form.value);

    // Hiển thị thông báo nhỏ (toast) khi nhấn Lưu
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Đang xử lý...",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
