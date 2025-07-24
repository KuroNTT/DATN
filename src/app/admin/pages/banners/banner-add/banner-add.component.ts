import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BannerService } from "../../../services/banner.service";

@Component({
  selector: "app-banner-add",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: "./banner-add.component.html",
  styleUrls: ["./banner-add.component.css"],
})
export class BannerAddComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ["", Validators.required],
      image: [null, Validators.required],
      link: [""],
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.form.patchValue({ image: this.selectedFile });
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.form.invalid || !this.selectedFile) {
      alert("Vui lòng nhập đầy đủ thông tin và chọn hình ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("file", this.selectedFile);
    formData.append("title", this.form.value.title);

    this.bannerService.uploadImage(formData).subscribe((res) => {
      const imageUrl = res.imageUrl;

      const data = {
        title: this.form.value.title,
        image: imageUrl,
        link: this.form.value.link,
      };

      this.bannerService.create(data).subscribe(() => {
        alert("Thêm banner thành công!");
        this.router.navigate(["/admin/banner"]);
      });
    });
  }
}
