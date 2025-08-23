import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../../environments/environment";
import { IOrder, IOrderDetail } from "../../../../core/models/structureData";
/* export class PurchaseComponent implements OnInit {

  tabs = [
    { label: 'Tất cả đơn mua', value: 'all' },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đã xác nhận', value: 'confirmed' },
    { label: 'Vận chuyển', value: 'shipping' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đã hủy', value: 'cancelled' }
  ];
  selectedTab = 'all';

  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    fetch(`${environment.apiUrl}/orders/my`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then((data: IOrder[]) => {
        this.orders = data;
        this.applyFilter();
      })
      .catch(err => console.error('Load đơn hàng thất bại:', err));
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedTab === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.selectedTab);
    }
  }

  async toggleOrderDetails(order: IOrder) {
    order.showDetails = !order.showDetails;

    if (order.showDetails && !order.detailsLoaded) {
      const token = sessionStorage.getItem('token');
      try {
        const res = await fetch(`${environment.apiUrl}/orders/${order.order_code}`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: IOrder = await res.json();

        // Gán thông tin chi tiết
        order.order_details = data.order_details;
        order.customer = data.customer;
        order.customer_address = data.customer_address;
        order.customer_phone_number = data.customer_phone_number;
        order.payment_method = data.payment_method;
        order.detailsLoaded = true;

      } catch (err) {
        console.error('Load chi tiết đơn hàng thất bại', err);
        order.order_details = [];
      }
    }
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
} */
@Component({
  selector: "app-purchase",
  imports: [CommonModule],
  templateUrl: "./purchase.component.html",
  styleUrls: ["./purchase.component.css"],
})
/* export class PurchaseComponent implements OnInit {
  tabs = [
    { label: 'Tất cả đơn mua', value: 'all' },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đã xác nhận', value: 'confirmed' },
    { label: 'Vận chuyển', value: 'shipping' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đã hủy', value: 'cancelled' }
  ];
  selectedTab = 'all';

  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    fetch(`${environment.apiUrl}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then((data: IOrder[]) => {
      this.orders = data;
      this.applyFilter();
    })
    .catch(err => console.error(err));
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedTab === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.selectedTab);
    }
  }

/*   toggleOrderDetails(order: IOrder) {
  order.showDetails = !order.showDetails;

  if (order.showDetails && !order.detailsLoaded) {
    const token = sessionStorage.getItem('token');
    fetch(`${environment.apiUrl}/orders/${order.order_code}`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: IOrder) => {
        order.order_details = data.order_details;
        order.customer = data.customer;
        order.customer_address = data.customer_address;
        order.customer_phone_number = data.customer_phone_number;
        order.payment_method = data.payment_method;
        order.detailsLoaded = true;
      })
      .catch(err => console.error('Load chi tiết đơn hàng thất bại', err));
  }
}

async toggleOrderDetails(order: IOrder) {
  order.showDetails = !order.showDetails;

  if (order.showDetails && !order.detailsLoaded) {
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch(`${environment.apiUrl}/orders/${order.order_code}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

      // Gán thông tin chi tiết, đảm bảo không null
      order.order_details = data?.order_details ?? [];
      order.customer = data?.customer ?? '';
      order.customer_address = data?.customer_address ?? '';
      order.customer_phone_number = data?.customer_phone_number ?? '';
      order.payment_method = data?.payment_method ?? '';
      order.detailsLoaded = true;

    } catch (err) {
      console.error('Load chi tiết đơn hàng thất bại', err);
      // Gán mặc định nếu lỗi
      order.order_details = [];
      order.detailsLoaded = true;
    }
  }
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
    if (action === 'Chi tiết') {
      this.toggleOrderDetails(order);
    } else {
      console.log(action, order.order_code);
    }
  }
} */
export class PurchaseComponent implements OnInit {
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  selectedTab = "all";
  tabs = [
    { label: "Tất cả đơn mua", value: "all" },
    { label: "Chờ xác nhận", value: "pending" },
    { label: "Đã xác nhận", value: "confirmed" },
    { label: "Vận chuyển", value: "shipping" },
    { label: "Hoàn thành", value: "completed" },
    { label: "Đã hủy", value: "cancelled" },
  ];

  ngOnInit() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    fetch(`${environment.apiUrl}/orders/my`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: IOrder[]) => {
        this.orders = data.map((o) => ({ ...o, showDetails: false }));
        this.applyFilter();
      })
      .catch((err) => console.error(err));
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedTab === "all") {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(
        (o) => o.status === this.selectedTab
      );
    }
  }

  // Chỉ load thông tin chung khi bấm Chi tiết
  async toggleOrderDetails(order: IOrder) {
    order.showDetails = !order.showDetails;

    if (order.showDetails && !order.customer) {
      // chưa load thông tin chung
      const token = sessionStorage.getItem("token");
      try {
        const res = await fetch(
          `${environment.apiUrl}/orders/${order.order_code}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Partial<IOrder> = await res.json();

        // Chỉ gán thông tin chung, không đụng đến order_details
        order.customer = data.customer;
        order.customer_address = data.customer_address;
        order.customer_phone_number = data.customer_phone_number;
        order.payment_method = data.payment_method;
      } catch (err) {
        console.error("Load chi tiết đơn hàng thất bại", err);
      }
    }
  }

  getActionButton(order: IOrder): { label: string } {
    switch (order.status) {
      case "pending":
        return { label: "Hủy đơn" };
      case "completed":
        return { label: "Đánh giá" };
      default:
        return { label: "Chi tiết" };
    }
  }

  handleOrderAction(order: IOrder) {
    const action = this.getActionButton(order).label;
    if (action === "Hủy đơn") {
      console.log("Hủy đơn:", order.order_code);
    } else if (action === "Đánh giá") {
      console.log("Đánh giá đơn:", order.order_code);
    } else if (action === "Chi tiết") {
      this.toggleOrderDetails(order);
    }
  }
}
