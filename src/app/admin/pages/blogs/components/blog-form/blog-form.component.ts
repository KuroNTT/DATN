import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BlogCategoryService } from "../../../../services/blog-category.service";
import { IBlog, IBlogCategory } from "../../../../../core/models/structureData";

@Component({
  selector: "app-blog-form",
  standalone: true,
  templateUrl: "./blog-form.component.html",
  styleUrls: ["./blog-form.component.css"],
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
})
export class BlogFormComponent implements OnInit, OnChanges {
  @Input() initialData?: Partial<IBlog>;
  @Input() currentAuthorName: string = "";
  @Input() authorId: string = "";
  @Output() formSubmit = new EventEmitter<Partial<IBlog>>();

  form!: FormGroup;
  previewThumbnail: string | ArrayBuffer | null = null;
  selectedThumbnail: File | null = null;
  categories: IBlogCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private blogCategoryService: BlogCategoryService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      title: ["", Validators.required],
      slug: ["", Validators.required],
      content: [""],
      author: ["", Validators.required],
      author_id: ["", Validators.required],
      thumbnail: [""],
      category_id: [null, Validators.required],
    });

    this.blogCategoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;

        if (this.initialData) {
          this.patchForm(this.initialData);
        } else if (this.currentAuthorName) {
          this.form.patchValue({
            author: this.currentAuthorName ?? "",
            author_id: this.authorId ?? null,
          });
        }
      },
      error: (err) => {
        console.error("Lỗi khi lấy danh mục:", err);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) return;

    if (changes["initialData"] && this.initialData) {
      this.patchForm(this.initialData);
    }

    if (changes["currentAuthorName"] || changes["authorId"]) {
      if (!this.initialData) {
        this.form.patchValue({
          author: this.currentAuthorName || "",
          author_id: this.authorId || null,
        });
      }
    }
  }

  private patchForm(data: Partial<IBlog>) {
    this.form.patchValue({
      id: data.id ?? null,
      title: data.title ?? "",
      slug: data.slug ?? "",
      content: data.content ?? "",
      author: data.author ?? "",
      author_id: data.author_id ?? null,
      thumbnail: data.thumbnail ?? "",
      category_id:
        data.category_id !== undefined && data.category_id !== null
          ? Number(data.category_id)
          : null,
    });
  }

  onSubmit() {
    console.log("✅ onSubmit called");

    if (this.form.valid) {
      const formValue: Partial<IBlog> = { ...this.form.value };
      delete formValue.author;
      console.log("Submitting form data:", formValue);
      console.log("Form after patch:", this.form.value);
      console.log("Categories:", this.categories);

      this.formSubmit.emit(formValue);
    } else {
      console.warn("Form invalid!", this.form.errors, this.form.value);
    }
  }

  get isEditMode(): boolean {
    return !!this.initialData?.id;
  }

  onThumbnailSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedThumbnail = fileInput.files[0];
      this.form.patchValue({ thumbnail: this.selectedThumbnail });
      const reader = new FileReader();
      reader.onload = () => {
        this.previewThumbnail = reader.result;
      };
      reader.readAsDataURL(this.selectedThumbnail);
    }
  }
}
