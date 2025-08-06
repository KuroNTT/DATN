import { Component } from '@angular/core';
import { IProduct, ICategory, IBrand } from '../../../../core/models/structureData';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  category_arr: ICategory[] = [];
  product_arr: IProduct[] = [];
  brand_arr: IBrand[] = [];
  p: number = 1;
  constructor(private pds: ProductService) { }

  ngOnInit() {
    this.loadProduct();
  }
  loadProduct() {
    this.pds.getAll().subscribe(data => {
      this.product_arr = data.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    });
  }

  deleteProduct(id: number) {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      this.pds.delete(id).subscribe(() => this.loadProduct());
    }
  }
  toggleStatus(pd: IProduct) {
    const newStatus = pd.status === 1 ? 0 : 1;

    this.pds.updateStatus(pd.id!, newStatus).subscribe({
      next: () => {
        pd.status = newStatus;
      },
      error: err => {
        console.error('Lỗi khi cập nhật trạng thái:', err);
      }
    });
  }


}
