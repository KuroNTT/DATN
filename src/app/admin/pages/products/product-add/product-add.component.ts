import { Component } from '@angular/core';
import { IProduct } from '../../../../core/models/structureData';
import { ProductService } from '../../../services/product.service';
import { ProductFormComponent } from '../components/product-form/product-form.component'
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-add',
  template: `<app-product-form 
  [isEditMode]="false" 
  (submitForm)="handleSubmit($event)" />`,
  standalone: true,
  imports: [ProductFormComponent]
})
export class ProductAddComponent {
  constructor(private productService: ProductService,
    private router: Router
  ) { }

  handleSubmit(data: IProduct) {
    this.productService.create(data).subscribe({
      next: res => {
        alert('Thêm sản phẩm thành công!');
        this.router.navigate(['admin/products']);
      },
      error: err => {
        alert('Thêm thất bại: ' + (err.error?.error || 'Lỗi không xác định'));
      }
    });
  }
}
