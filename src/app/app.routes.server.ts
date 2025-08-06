import { RenderMode, ServerRoute } from "@angular/ssr";
import { Routes } from "@angular/router";

async function getProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch("http://localhost:3000/api/products");
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
    const res = await fetch("http://localhost:3000/api/blogs");
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
    const res = await fetch("http://localhost:3000/api/categories");
    const categories = await res.json();
    return categories.map((c: any) => c.id.toString());
  } catch (err) {
    console.error("Lỗi khi fetch categories:", err);
    return [];
  }
}

async function getBlogIds(): Promise<string[]> {
  try {
    const res = await fetch("http://localhost:3000/api/blogs");
    const blogs = await res.json();
    return blogs.map((b: any) => b.id.toString());
  } catch (err) {
    console.error("Lỗi khi fetch blog ids:", err);
    return [];
  }
}

async function getBlogCategoryIds(): Promise<string[]> {
  try {
    const res = await fetch("http://localhost:3000/api/blog-categories");
    const blogCategories = await res.json();
    return blogCategories.map((bc: any) => bc.id.toString());
  } catch (err) {
    console.error("Lỗi khi fetch blog categories:", err);
    return [];
  }
}

async function getBannerIds(): Promise<string[]> {
  try {
    const res = await fetch("http://localhost:3000/api/banners");
    const banners = await res.json();
    return banners.map((b: any) => b.id.toString());
  } catch (err) {
    console.error("Lỗi khi fetch banners:", err);
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
    path: "admin/products/edit/:slug",
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const slugs = await getProductSlugs();
      return slugs.map((slug) => ({ slug }));
    },
  },
  {
    path: "admin/categories/edit/:id",
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const ids = await getCategoryIds();
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: "admin/blogs/edit/:id",
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const ids = await getBlogIds();
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: "admin/blog-categories/edit/:id",
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const ids = await getBlogCategoryIds();
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: "admin/banners/edit/:id",
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const ids = await getBannerIds();
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: "**",
    renderMode: RenderMode.Prerender,
  },
];
