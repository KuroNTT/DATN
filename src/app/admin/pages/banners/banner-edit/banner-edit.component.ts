import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BannerService } from "../../../services/banner.service";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../../enviroments/environment";

@Component({
  selector: "app-banner-edit",
  templateUrl: "./banner-edit.component.html",
  styleUrls: ["./banner-edit.component.css"],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class BannerEditComponent implements OnInit {
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  bannerId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bannerService: BannerService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ["", Validators.required],
      link: [""],
      image: [""], // chỉ dùng để validate client
    });
  }

  ngOnInit() {
    this.bannerId = Number(this.route.snapshot.paramMap.get("id"));
    this.bannerService.getById(this.bannerId).subscribe((banner) => {
      this.form.patchValue({
        title: banner.title,
        link: banner.link,
      });
      this.previewUrl = banner.image_url.startsWith("http")
        ? banner.image_url
        : `${environment.apiUrl}/${banner.image_url}`;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const updateBanner = () => {
      const data = {
        title: this.form.value.title,
        link: this.form.value.link,
        image: this.previewUrl?.toString().includes("base64")
          ? ""
          : this.previewUrl,
      };

      this.bannerService.update(this.bannerId, data).subscribe(() => {
        alert("Cập nhật banner thành công!");
        this.router.navigate(["/admin/banner"]);
      });
    };

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append("file", this.selectedFile);

      this.bannerService.uploadImage(formData).subscribe((res) => {
        this.form.patchValue({ image: res.imageUrl });
        this.previewUrl = res.imageUrl;
        updateBanner();
      });
    } else {
      updateBanner();
    }
  }
}
