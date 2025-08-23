import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-cancel-order",
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./cancel-order.component.html",
  styleUrls: ["./cancel-order.component.css"],
})
export class CancelOrderComponent {
  reason: string = "";

  constructor(private dialogRef: MatDialogRef<CancelOrderComponent>) {}

  submit(form: any) {
    if (form.valid && this.reason.trim()) {
      this.dialogRef.close(this.reason.trim());
    }
  }

  close() {
    this.dialogRef.close();
  }
}
