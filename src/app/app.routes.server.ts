import { RenderMode, ServerRoute } from "@angular/ssr";
import { environment } from "../environments/environment";

// ===== Fetch helpers =====
async function getProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/products`);
    const products = await res.json();
    return products.map((p: any) => p.slug).filter(Boolean);
  } catch (err) {
    console.error("Lỗi khi fetch sản phẩm:", err);
    return [];
  }
}

async function getBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/blogs`);
    const blogs = await res.json();
    return blogs.map((b: any) => b.slug).filter(Boolean);
  } catch (err) {
    console.error("Lỗi khi fetch blog:", err);
    return [];
  }
}

async function getCategorySlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${environment.apiUrl}/categories`);
    const categories = await res.json();
    return categories.map((c: any) => c.slug).filter(Boolean);
  } catch (err) {
    console.error("Lỗi khi fetch category slugs:", err);
    return [];
  }
}

// ===== Server routes =====
export const serverRoutes: ServerRoute[] = [
  // Public SEO pages
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
  { path: "search", renderMode: RenderMode.Client },
  { path: "product", renderMode: RenderMode.Client },
  // Admin routes → only client render (avoid prerender build-time)
  { path: "admin", renderMode: RenderMode.Client },
  { path: "admin/**", renderMode: RenderMode.Client },

  // Catch-all for other public pages
  { path: "**", renderMode: RenderMode.Prerender },
];
