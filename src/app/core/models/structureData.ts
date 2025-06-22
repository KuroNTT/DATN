export interface ICategory {
  id: number;
  name: string;
  description?: string;
  sort_order?: number;
  status: number;
}

export interface IProduct {
  id: number;
  name: string;
  category_id: string;
  description?: string;
  image: string;
  price: number;
  price_sale: number;
  origin_country: string;
  status: number;
  hot: number;
  view: number;
  created_at: string;
  update_at: string;
}
