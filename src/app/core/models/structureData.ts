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

export interface IShoeHeight {
  id: number;
  name: string;
}

export interface IPrice_ranges {
  id: number;
  name: string;
  min: number;
  max: number | null;
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
  hover_image: string;
  isHovered?: boolean;
  price: number;
  price_sale: number;
  origin_country: string;
  status: number;
  hot: number;
  view: number;
  created_at: string;
  update_at: string;
  variants: IProductVariant[];
  style_code?: string;
  category?: ICategory;
  isLiked?: boolean;
  brand?: IBrand;
}

export interface IProductVariantSize {
  size: ISize;
  stock?: number;
}

export interface IProductVariant {
  id: number;
  color_id: number;
  shoe_height?: IShoeHeight;
  style_code: string;
  image_url: string;
  status: number;
  created_at: string;
  updated_at: string;
  images: IProductImage[];
  color?: IColor;
  size?: ISize;
  product_variant_sizes: IProductVariantSize[];
}

export interface IProductImage {
  id: number;
  variant_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ISize {
  id: number;
  size: number;
  created_at: string;
  update_at: string;
}

export interface IColor {
  id: number;
  color_name: string;
  original_name: string;
  description: string;
}

export interface IWishlist {
  id?: number;
  user_id?: number;
  variant_id: number;
  size: string | number;
  create_at?: string;
  is_active?: boolean;
}

