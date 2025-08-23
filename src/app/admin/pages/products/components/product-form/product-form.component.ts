import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IProduct, ICategory, IBrand, IGender, IShoeHeight, ISize } from '../../../../../core/models/structureData';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class ProductFormComponent implements OnInit {
  @Output() submitForm = new EventEmitter<IProduct>();
  @Input() formData: IProduct | null = null;
  @Input() isEditMode = false;

  form!: FormGroup;
  brands: IBrand[] = [];
  categories: ICategory[] = [];
  genders: IGender[] = [];
  shoeHeights: IShoeHeight[] = [];
  sizes: ISize[] = [];
  previewImages: string[][] = [];
  deletedVariantIds: number[] = [];
  variantImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
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
    //Gọi hàm tạo trực tiếp slug từ tên sp
    this.form.get('name')?.valueChanges.subscribe(name => {
      const slug = this.slugify(name);
      this.form.get('slug')?.setValue(slug, { emitEvent: false });
    });
    // Lấy danh sách size, sau đó mới xử lý variants
    this.productService.getSizes().subscribe((res: any) => {
      this.sizes = res;
      if (this.isEditMode && this.formData) {
        this.form.patchValue(this.formData);
        this.patchVariants(this.formData.variants || []);
        this.variantImages = this.formData.variants.map(v => v.image_url);
      } else {
        this.addVariant();
      }
    });
    //Load dữ liệu bảng khác lên form
    this.productService.getBrand().subscribe(res => this.brands = res);
    this.productService.getCategory().subscribe(res => this.categories = res);
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

  getSizeNameById(id: any): string {
    const size = this.sizes.find(s => s.id === id);
    return size ? `Size ${size.size}` : 'Size ?'
  }

  getSizesFromGroup(variantGroup: FormGroup): FormArray {
    return variantGroup.get('sizes') as FormArray;
  }

  getImagesFromGroup(variantGroup: FormGroup): FormArray {
    return variantGroup.get('images') as FormArray;
  }
  //Variant
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

    this.sizes.forEach(s => {
      (variantGroup.get('sizes') as FormArray).push(
        this.fb.group({ size_id: [s.id], stock: [0, [Validators.min(0)]] })
      );
    });

    for (let i = 0; i < 8; i++) {
      (variantGroup.get('images') as FormArray).push(this.fb.control(''));
    }
    //Thêm vra
    this.variants.push(variantGroup);
    this.previewImages.push([]);
  }
  //Xóa vra
  removeVariant(index: number) {
    const variantGroup = this.variants.at(index) as FormGroup;
    const variantId = variantGroup.get('id')?.value;
    if (variantId) {
      this.deletedVariantIds.push(variantId);
    }
    this.variants.removeAt(index);
    this.previewImages.splice(index, 1);
  }

  //Other: hàm thêm tồn kho hàng loạt
  applyStockToAllSizes(event: Event, variantIndex: number) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (!isNaN(value)) {
      const sizesArray = this.getSizes(variantIndex);
      sizesArray.controls.forEach(sizeGroup => {
        sizeGroup.get('stock')?.setValue(value);
      });
    }
  }
  //Hàm tạo slug trực tiếp trong form 
  slugify(str: string): string {
    return str.normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase().trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  //Image tạo lnk ảnh trên cloudinary
  uploadToCloudinary(file: File, publicId?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    if (publicId) formData.append('public_id', publicId);

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
  //Tạo ảnh chính của products
  uploadMainImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.uploadToCloudinary(file).then(url => {
        this.form.get('image')?.setValue(url);
        input.value = '';
      }).catch(err => alert('Upload ảnh thất bại'));
    }
  }
  //Tạo ảnh của vra
  uploadVariantImage(event: Event, variantIndex: number) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const slug = this.slugify(this.form.get('name')?.value || 'product');
    const timestamp = Date.now(); // Tạo publicId duy nhất
    const publicId = `images/${slug}-v${variantIndex + 1}-${timestamp}`;
    this.uploadToCloudinary(file, publicId)
      .then(url => {
        console.log(' Đã upload:', url);
        this.variantImages[variantIndex] = url;
        this.variants.at(variantIndex).get('image_url')?.setValue(url);
        input.value = '';
      })
      .catch(err => {
        alert('Upload ảnh biến thể thất bại');
        console.error(err);
      });
  }
  //Tạo ảnh chi tiết của biến thể
  handleDetailImagesUpload(event: Event, variantIndex: number) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;
    const uploads = Array.from(files).slice(0, 8);
    const slug = this.slugify(this.form.get('name')?.value || 'product');
    //Phân loại ảnh chính và ảnh chi tiết
    const mainImage = uploads.find(file => !file.name.includes('-dt'));
    const detailImages = uploads
      .filter(file => file.name.includes('-dt'))
      .sort((a, b) => a.name.localeCompare(b.name)); //Giữ thứ tự dt1 → dt7
    const orderedFiles = [mainImage, ...detailImages].filter((file): file is File => !!file);
    const uploadPromises = orderedFiles.map((file, idx) => {
      const timestamp = Date.now();
      const publicId =
        idx === 0
          ? `images/${slug}-v${variantIndex + 1}-${timestamp}`          //Ảnh chính
          : `images/${slug}-v${variantIndex + 1}-dt${idx}-${timestamp}`; //Ảnh chi tiết
      return this.uploadToCloudinary(file, publicId);
    });
    Promise.all(uploadPromises).then((urls: string[]) => {
      const imagesArray = this.getImages(variantIndex);
      imagesArray.clear();
      urls.forEach(url => imagesArray.push(this.fb.control(url)));
      //Đảm bảo mảng có đủ 8 phần tử
      while (urls.length < 8) {
        urls.push(undefined as any);
      }
      this.previewImages[variantIndex] = urls;
      input.value = '';
    });
  }
  //Edit vra
  patchVariants(variants: any[]) {
    const variantFormArray = this.form.get('variants') as FormArray;
    variantFormArray.clear();
    this.previewImages = [];

    variants.forEach(variant => {
      const variantGroup = this.fb.group({
        id: [variant.id || null],
        color_id: [variant.color_id || 0],
        color_name: [variant.color?.color_name || '', Validators.required],
        original_name: [variant.color?.original_name || '', Validators.required],
        shoe_height_id: [variant.shoe_height_id || ''],
        style_code: [variant.style_code || ''],
        image_url: [variant.image_url || ''],
        sizes: this.fb.array([]),
        images: this.fb.array([]),
      });

      const sizesArray = variantGroup.get('sizes') as FormArray;
      (variant.product_variant_sizes || []).forEach((s: any) => {
        sizesArray.push(this.fb.group({
          size_id: [s.size_id],
          stock: [s.stock],
        }));
      });

      const imagesArray = variantGroup.get('images') as FormArray;
      const imageUrls = (variant.images || []).map((img: any) =>
        typeof img === 'string' ? img : img.image_url || ''
      );

      imageUrls.forEach((url: string) => imagesArray.push(this.fb.control(url)));

      while (imagesArray.length < 8) {
        imagesArray.push(this.fb.control(''));
      }
      variantFormArray.push(variantGroup);
      this.previewImages.push([...imageUrls]);
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.value;
    if (!data.image && data.variants?.length > 0) {
      data.image = data.variants[0].image_url;
    }
    const payload = {
      ...data,
      deletedVariantIds: this.deletedVariantIds
    };

    this.submitForm.emit(payload);
  }
}
