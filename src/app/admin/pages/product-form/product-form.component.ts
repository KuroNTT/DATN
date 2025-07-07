import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct, ICategory, IBrand } from '../../../core/models/structureData';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  p:number = 1;
  product_arr: IProduct[] = [];
  loai_arr: ICategory[] = [];
  id_loai:string = "-1"; //id dc chon
  ten_loai:string = '';
  sp_arr_goc: IProduct[] = [];
 constructor(
    private pds: ProductService,
    private route: ActivatedRoute,
    private router: Router) { }
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.pds.getOne(id).subscribe(data => {
        this.product = data
        
      })
    }
  }

 
}