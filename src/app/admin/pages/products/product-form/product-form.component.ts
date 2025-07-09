import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      price: [0, Validators.required],
      price_sale: [0],
      image: [''],
      origin_country: [''],
      brand_id: [1],
      category_id: [1],
      gender_id: [1],
      status: [1],
      hot: [0],
      view: [0],
      description: [''],
      variants: this.fb.array([]),
    });

    // Tự động tạo slug
    this.form.get('name')?.valueChanges.subscribe(name => {
      const slug = this.slugify(name);
      this.form.get('slug')?.setValue(slug, { emitEvent: false });
    });

    // Khởi tạo 1 biến thể mặc định
    this.addVariant();
  }

  get variants(): FormArray {
    return this.form.get('variants') as FormArray;
  }

  getSizes(variantIndex: number): FormArray {
    return this.variants.at(variantIndex).get('sizes') as FormArray;
  }

  getImages(variantIndex: number): FormArray {
    return this.variants.at(variantIndex).get('images') as FormArray;
  }

  addVariant() {
    const variantGroup = this.fb.group({
      color_id: [0, Validators.required],
      color_name: ['', Validators.required],
      original_name: ['', Validators.required],
      shoe_height_id: [2], // mặc định "vừa"
      style_code: [''],
      image_url: [''],
      sizes: this.fb.array([]),
      images: this.fb.array([]),
    });

    // Tạo 12 size từ 1 → 12
    for (let sizeId = 1; sizeId <= 12; sizeId++) {
      this.getSizesFromGroup(variantGroup).push(
        this.fb.group({
          size_id: [sizeId],
          stock: [0]
        })
      );
    }

    // Thêm sẵn 8 ảnh
    for (let i = 0; i < 8; i++) {
      this.getImagesFromGroup(variantGroup).push(this.fb.control(''));
    }

    this.variants.push(variantGroup);
  }

  getSizesFromGroup(variantGroup: FormGroup): FormArray {
    return variantGroup.get('sizes') as FormArray;
  }

  getImagesFromGroup(variantGroup: FormGroup): FormArray {
    return variantGroup.get('images') as FormArray;
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  slugify(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log('Form không hợp lệ', this.form.value);
      return;
    }

    const data = this.form.value;
    console.log('📤 Dữ liệu gửi đi:', data);

    this.productService.create(data).subscribe({
      next: res => {
        alert('Thêm sản phẩm thành công!');
        console.log('✔️ Kết quả:', res);
      },
      error: err => {
        alert('Thêm thất bại: ' + (err.error?.error || 'Lỗi không xác định'));
        console.error('Lỗi:', err);
      }
    });
  }
}
