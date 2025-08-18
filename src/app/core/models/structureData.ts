export interface ICategory {
  id: number;
  name: string;
  checked?: boolean;
  description?: string;
  sort_order?: number;
  status: number;
}

export interface IBanner {
  id: number;
  image_url: string;
  title: string;
  description: string;
  link: string;
  active: boolean;
  start_date: string;
  end_date: string;
  product_id: number;
  category_id: number;
  created_by: string;
  position: string;
  created_at: string;
  update_at: string;
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

export interface IBlog {
  id: number;
  title: string;
  slug?: string;
  content: string;
  thumbnail: string;
  author_id: number;
  author?: {
    id: number;
    name: string;
  };
  category_id: number;
  created_at: string;
  updated_at: string;
  is_published: number;
  sort_order: number;
  status: number;
}

export interface ISize {
  id: number;
  size: number;
  stock: number;
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
  isFavorited?: boolean;
  gender?: IGender;
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
  color_name?: string;
  size?: ISize;
  stock: number;
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
  hex: string;
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

/* Admin */
export interface IBlogCreate {
  title: string;
  slug?: string;
  content: string;
  thumbnail: string;
  category_id: number;
  author_id: number;
  is_published?: number;
  sort_order?: number;
  status?: number;
}
export interface ICategoryCreate {
  name: string;
  description: string;
  sort_order: number;
  status: number;
}

export interface IBlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IBanner {
  id: number;
  image_url: string;
  title: string;
  description: string;
  link: string;
  active: boolean;
  start_date: string;
  end_date: string;
  product_id: number;
  category_id: number;
  create_by: number;
  position: string;
  created_at: string;
  updated_at: string;
}

export interface ICategoryCreate {
  name: string;
  description: string;
  sort_order: number;
  status: number;
}
