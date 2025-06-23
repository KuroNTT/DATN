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
  brand_id: string;
  description?: string;
  slug: string;
  image: string;
  price: number;
  price_sale: number;
  origin_country: string;
  status: number;
  hot: number;
  view: number;
  created_at: string;
  update_at: string;
  variants: IProductVariant[];
}

export interface IProductVariant {
  id: number;
  color_id: number;
  shoe_height_id: number;
  style_code: string;
  image_url: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IProductImage {
  id: number;
  variant_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}
