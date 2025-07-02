import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-purchase',
  imports: [CommonModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css',

})
export class PurchaseComponent {
tabs = [
  'Tất cả',
  'Chờ thanh toán',
  'Vận chuyển',
  'Chờ giao hàng',
  'Hoàn thành',
  'Đã huỷ',
  'Trả hàng/Hoàn tiền'
];

selectedTab = 'Tất cả';

}
