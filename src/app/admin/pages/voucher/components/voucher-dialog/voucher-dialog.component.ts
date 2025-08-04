import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-voucher-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./voucher-dialog.component.html",
})
export class VoucherDialogComponent implements OnInit {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<VoucherDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  edit: boolean = false;

  voucherForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.voucherForm = this.fb.group({
      code: ["", Validators.required],
      description: [""],
      discount_type: ["percent", Validators.required],
      discount_value: [null, [Validators.required, Validators.min(0.01)]],
      min_order_value: [null],
      quantity: [1, [Validators.required, Validators.min(1)]],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      is_active: [true],
    });
    if (this.data) {
      this.edit = true;
      this.voucherForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.voucherForm.invalid) {
      this.voucherForm.markAllAsTouched();
      return;
    }

    const { start_date, end_date } = this.voucherForm.value;
    if (new Date(start_date) > new Date(end_date)) {
      this.errorMessage = "Ngày kết thúc phải sau ngày bắt đầu";
      return;
    }

    this.errorMessage = null;
    if(this.edit){
      this.dialogRef.close({voucher: this.voucherForm.value, edit: true});
      return;
    }
    this.dialogRef.close(this.voucherForm.value); // Gửi data về component cha
  }

  onCancel() {
    this.dialogRef.close(null); // Đóng dialog
  }
}
