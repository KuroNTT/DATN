export interface ICategory {
  id: number;
  name: string;
  checked?: boolean;
  description?: string;
  sort_order?: number;
  status: number;
}
export interface IBrand {
  id: number;
  name: string;
  slug: string;
  checked?: boolean;
  description?: string;
  sort_order?: number;
  status: number;
}

export interface ISize {
  id: number;
  size: number;
  checked?: boolean;
  created_at: string;
  update_at: string;
}
export interface IGender {
  id: number;
  name: string;
  slug: string;
  checked?: boolean;
}
export interface IPrice_ranges {
  id: number;
  name: string;
  min: number;
  max: number;
  checked?: boolean;
}

export interface IProduct {
  id: number;
  name: string;
  category_id: number;
  brand_id: number;
  gender_id: number;
  size_id: number;
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
