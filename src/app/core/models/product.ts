import { IProductVariant } from "./structureData"; // ✅ đường dẫn phải đúng

export class Product {
  id: number = 0;
  name: string = "";
  slug: string = "";
  description?: string = "";
  price: number = 0;
  price_sale: number = 0;
  origin_country: string = "";
  category_id: number = 0;
  brand_id: number = 0;
  gender_id: number = 0;
  size_id: number = 0;
  image: string = "";
  hover_image: string = "";
  status: number = 1;
  hot: number = 0;
  view: number = 0;
  created_at: string = "";
  update_at: string = "";
  variants: IProductVariant[] = [];
}
