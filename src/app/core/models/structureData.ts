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
}

export interface IProductVariantSize {
  size: ISize;
  stock?: number;
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
