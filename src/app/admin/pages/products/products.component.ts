import { Component } from '@angular/core';
import { IProduct, ICategory, IBrand } from '../../../core/models/structureData';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  category_arr: ICategory[] = [];
  product_arr: IProduct[] = [];
  brand_arr: IBrand[] = [];

  constructor(private pds: ProductService) { }

  ngOnInit() { this.loadProduct() }
  loadProduct() {
  this.pds.getAll().subscribe(data => {
    this.product_arr = data.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  });
}

  deleteProduct(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.pds.delete(id).subscribe(() => this.loadProduct())
    }
  }

}
