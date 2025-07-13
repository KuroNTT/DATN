import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ICategory, IBrand, IGender, IShoeHeight, ISize } from "../../../../core/models/structureData";
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  brands: IBrand[] = [];
  categories: ICategory[] = [];
  genders: IGender[] = [];
  shoeHeights: IShoeHeight[] = [];
  sizes: ISize[] = [];
  //preview anh
  previewImages: string[][] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) { }
  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      price: ['0', Validators.required],
      price_sale: ['0'],
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

    this.productService.getBrand().subscribe(res => this.brands = res);
    this.productService.getCategory().subscribe(res => this.categories = res);
    this.productService.getSizes().subscribe(res => this.sizes = res)
    this.productService.getGender().subscribe(res => this.genders = res);
    this.productService.getShoeheights().subscribe(res => this.shoeHeights = res);

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
  getSizeNameById(id: number): string {
    const size = this.sizes.find(s => s.id === id);
    return size ? `Size ${size.size}` : 'Size ?';
  }
  addVariant() {
    const variantGroup = this.fb.group({
      color_id: [0, Validators.required],
      color_name: ['', Validators.required],
      original_name: ['', Validators.required],
      shoe_height_id: [''],
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
      (variantGroup.get('images') as FormArray).push(this.fb.control(''));
    }

    this.variants.push(variantGroup);
    this.previewImages.push([]); // mỗi biến thể 1 mảng ảnh

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
  uploadToCloudinary(file: File, publicId?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    if (publicId) {
      formData.append('public_id', publicId);
    }
    return fetch('https://api.cloudinary.com/v1_1/dptdasr63/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.secure_url) return data.secure_url;
        else throw new Error('Upload thất bại');
      });
  }
  uploadMainImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadToCloudinary(file).then(url => {
        this.form.get('image')?.setValue(url);
      }).catch(err => {
        alert('Upload ảnh thất bại');
        console.error(err);
      });
    }
  }
  uploadVariantImage(event: Event, variantIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadToCloudinary(file).then(url => {
        this.variants.at(variantIndex).get('image_url')?.setValue(url);
      }).catch(err => {
        alert('Upload ảnh biến thể thất bại');
        console.error(err);
      });
    }
  }
  handleDetailImagesUpload(event: Event, variantIndex: number) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const uploads = Array.from(files).slice(0, 8);
      const slug = this.slugify(this.form.get('name')?.value || 'product');
      const uploadPromises = uploads.map((file, idx) => {
        const publicId = `images/${slug}-v${variantIndex + 1}-dt${idx + 1}`;
        return this.uploadToCloudinary(file, publicId);
      });

      Promise.all(uploadPromises).then(urls => {
        const imagesArray = this.getImages(variantIndex);
        imagesArray.clear();
        urls.forEach(url => imagesArray.push(this.fb.control(url)));

        // Cập nhật ảnh preview
        this.previewImages[variantIndex] = urls;
      }).catch(err => {
        alert('Lỗi khi upload ảnh chi tiết');
        console.error(err);
      });
    }
  }






  onSubmit() {
    if (this.form.invalid) {
      console.log('Form không hợp lệ:', this.form.value);
      console.log('Form errors:', this.form.errors);
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.warn(`Trường '${key}' không hợp lệ`, control.errors);
        }
      });

      return;
    }

    const data = this.form.value;
    console.log('Dữ liệu gửi đi:', data);

    this.productService.create(data).subscribe({
      next: res => {
        alert('Thêm sản phẩm thành công!');
        console.log(' Kết quả:', res);
      },
      error: err => {
        alert('Thêm thất bại: ' + (err.error?.error || 'Lỗi không xác định'));
        console.error('Lỗi:', err);
      }
    });
  }
}
