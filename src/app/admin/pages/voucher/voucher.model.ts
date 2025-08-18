export interface Voucher {
  id: number;
  code: string;
  description: string;
  discount_type: 'fixed' | 'percent';
  discount_value: number;
  min_order_value: number;
  quantity: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}
