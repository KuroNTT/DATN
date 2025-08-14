import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BannerService } from "../../../../services/banner.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-banner-form",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./banner-form.component.html",
})
export class BannerFormComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.isEdit = !!this.id;

    this.form = this.fb.group({
      title: ["", Validators.required],
      image: ["", Validators.required],
      link: [""],
      position: ["", Validators.required],
      status: ["", Validators.required],
    });

    if (this.isEdit) {
      this.bannerService.getById(this.id).subscribe((banner) => {
        this.form.patchValue(banner);
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const data = this.form.value;

    if (this.isEdit) {
      this.bannerService.update(this.id, data).subscribe(() => {
        this.router.navigate(["/admin/banner"]);
      });
    } else {
      this.bannerService.create(data).subscribe(() => {
        this.router.navigate(["/admin/banner"]);
      });
    }
  }
}
