import { RenderMode, ServerRoute } from "@angular/ssr";
import { Routes } from "@angular/router";
import { environment } from "../environments/environment";

async function getProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/products`);
    const products = await res.json();
    return products
      .map((p: any) => p.slug)
      .filter((slug: string | undefined) => !!slug);
  } catch (err) {
    console.error("Lỗi khi fetch sản phẩm:", err);
    return [];
  }
}

async function getBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/blogs`);
    const blogs = await res.json();
    return blogs
      .map((b: any) => b.slug)
      .filter((slug: string | undefined) => !!slug);
  } catch (err) {
    console.error("Lỗi khi fetch blog:", err);
    return [];
  }
}

async function getCategoryIds(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/categories`);
    const categories = await res.json();
    return categories.map((c: any) => c.id.toString());
  } catch (err) {
    console.error("Lỗi khi fetch categories:", err);
    return [];
  }
}

async function getBlogIds(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/blogs`);
    const blogs = await res.json();
    return blogs.map((b: any) => b.id.toString());
  } catch (err) {
    console.error("Lỗi khi fetch blog ids:", err);
    return [];
  }
}

async function getBlogCategoryIds(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/blog-categories`);
    const blogCategories = await res.json();
    return blogCategories.map((bc: any) => bc.id.toString());
  } catch (err) {
    console.error("Lỗi khi fetch blog categories:", err);
    return [];
  }
}

async function getBannerIds(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/banners`);
    const banners = await res.json();
    return banners.map((b: any) => b.id.toString());
  } catch (err) {
    console.error("Lỗi khi fetch banners:", err);
    return [];
  }
}

async function getCategorySlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/categories`);
    const categories = await res.json();
    return categories
      .map((c: any) => c.slug)
      .filter((slug: string | undefined) => !!slug);
  } catch (err) {
    console.error("Lỗi khi fetch category slugs:", err);
    return [];
  }
}

export const serverRoutes: ServerRoute[] = [
  {
    path: "product-detail/:slug",
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const slugs = await getProductSlugs();
      return slugs.map((slug) => ({ slug }));
    },
  },
  {
    path: "blog/:slug",
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const slugs = await getBlogSlugs();
      return slugs.map((slug) => ({ slug }));
    },
  },

  {
    path: "category/:slug",
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const slugs = await getCategorySlugs();
      return slugs.map((slug) => ({ slug }));
    },
  },
  {
    path: "**",
    renderMode: RenderMode.Prerender,
  },
];
