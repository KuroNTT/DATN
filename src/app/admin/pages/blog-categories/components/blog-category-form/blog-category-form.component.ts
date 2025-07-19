import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { IBlogCategory } from "../../../../../core/models/structureData";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-blog-category-form",
  standalone: true,
  templateUrl: "./blog-category-form.component.html",
  styleUrls: ["./blog-category-form.component.css"],
  imports: [ReactiveFormsModule, CommonModule],
})
export class BlogCategoryFormComponent implements OnInit, OnChanges {
  @Input() initialData?: Partial<IBlogCategory>;
  @Input() onSubmitForm!: (data: Partial<IBlogCategory>) => void;

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ["", Validators.required],
      slug: ["", Validators.required],
      description: [""],
    });

    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["initialData"] && this.form) {
      this.form.patchValue(this.initialData || {});
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.onSubmitForm(this.form.value);
    }
  }
  get isEditMode(): boolean {
    return !!this.initialData?.id;
  }
}
