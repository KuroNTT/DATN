import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from "../../../../../environments/environment";
import { IOrder, IOrderDetail } from '../../../../core/models/structureData';
@Component({
  selector: 'app-purchase',
  imports: [CommonModule],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
})
export class PurchaseComponent implements OnInit {
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  selectedTab = 'all';
  tabs = [
    { label: 'Tất cả đơn mua', value: 'all' },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đã xác nhận', value: 'confirmed' },
    { label: 'Vận chuyển', value: 'shipping' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đã hủy', value: 'cancelled' }
  ];

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    fetch(`${environment.apiUrl}/orders/my`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: IOrder[]) => {
        this.orders = data.map(o => ({ ...o, showDetails: false }));
        this.applyFilter();
      })
      .catch(err => console.error(err));
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredOrders = this.selectedTab === 'all'
      ? this.orders
      : this.orders.filter(o => o.status === this.selectedTab);
  }

  toggleOrderDetails(order: IOrder) {
    order.showDetails = !order.showDetails;
  }

  getActionButton(order: IOrder): { label: string } {
    switch (order.status) {
      case 'pending': return { label: 'Hủy đơn' };
      case 'completed': return { label: 'Đánh giá' };
      default: return { label: 'Chi tiết' };
    }
  }

  handleOrderAction(order: IOrder) {
    const action = this.getActionButton(order).label;
    if (action === 'Hủy đơn') {
      console.log('Hủy đơn:', order.order_code);
    } else if (action === 'Đánh giá') {
      console.log('Đánh giá đơn:', order.order_code);
    } else {
      this.toggleOrderDetails(order);
    }
  }
}
