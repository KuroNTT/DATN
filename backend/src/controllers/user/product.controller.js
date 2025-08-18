
const { Op, Sequelize } = require("sequelize");
require("../../models/associations");
// Models
const ProductModel = require("../../models/Product");
const ProductVariantModel = require("../../models/ProductVariant");
const ProductImageModel = require("../../models/ProductImage");
const CategoryModel = require("../../models/Category");
const ColorModel = require("../../models/Color");
const VariantSizeModel = require("../../models/VariantSize");
const SizeModel = require("../../models/Size");
const ShoeHeightModel = require("../../models/ShoeHeight");
const GenderModel = require("../../models/Gender");
const BrandModel = require("../../models/Brand");

/* ======================================================================
   Tiện ích lọc màu “nhóm” (không đổi schema, không dùng COLLATE đặc biệt)
   ====================================================================== */
const COLOR_GROUPS = {
  trang: ["trang", "trang nga", "trang sang", "trang sua", "trang kem", "off white", "off-white", "ivory", "cream"],
  do: ["do", "do do", "do tuoi", "do dam", "do ruou vang", "burgundy", "maroon", "wine"],
  den: ["den", "den tuyen", "black"],
  xam: ["xam", "xam tro", "xam bac", "xam lanh", "ghi", "silver", "grey", "gray"],
  // vang: ["vang", "gold"],
};

const toSlug = (s) => String(s).toLowerCase().trim().replace(/đ/g, "d").replace(/Đ/g, "D");

const normalizeColorSlug = (input) => {
  const s = toSlug(input);
  if (s.includes("trang")) return "trang";
  if (s.includes("do")) return "do";
  if (s.includes("den")) return "den";
  if (s.includes("vang")) return "vang";
  if (/(xam|ghi|silver|grey|gray|vang)/.test(s)) return "xam";
  return s; // fallback nếu không khớp nhóm nào
};

function expandColorTokens(keywords) {
  const slugs = keywords.map(normalizeColorSlug);
  const tokens = new Set();
  slugs.forEach((s) => {
    const arr = COLOR_GROUPS[s];
    if (arr?.length) arr.forEach((t) => tokens.add(toSlug(t)));
    else tokens.add(toSlug(s));
  });
  return Array.from(tokens);
}

/**
 * Trả về where-object DÙNG FN (không literal) cho include { as: 'color' }
 * LƯU Ý alias:
 *  - Trong include của alias 'color', phải dùng Sequelize.col('color_name')
 *    (KHÔNG dùng 'color.color_name'), nếu không dễ sinh SQL lỗi → 500.
 */
function buildColorWhere(tokens) {
  if (!tokens.length) return null;

  // LOWER(REPLACE(REPLACE(color_name,'đ','d'),'Đ','D'))
  const normalizedExpr = Sequelize.fn(
    "LOWER",
    Sequelize.fn(
      "REPLACE",
      Sequelize.fn("REPLACE", Sequelize.col("color_name"), "đ", "d"),
      "Đ",
      "D"
    )
  );

  return {
    [Op.or]: tokens.map((tok) =>
      Sequelize.where(normalizedExpr, { [Op.like]: `%${tok}%` })
    ),
  };
}

/* ======================================================================
   1) GET /products
   ====================================================================== */
exports.getAllProducts = async (req, res) => {
  try {
    // Query params
    const searchQuery = req.query.q || "";

    const collarIds = String(req.query.collars || "")
      .split(",").map(Number).filter(Boolean);

    const brandIds = String(req.query.brand ?? req.query.brands ?? "")
      .split(",").map(Number).filter(Boolean);

    const genderIds = String(req.query.genders || "")
      .split(",").map(Number).filter(Boolean);

    const categoryIds = String(req.query.categories || "")
      .split(",").map(Number).filter(Boolean);

    const sizeIds = String(req.query.sizes || "")
      .split(",").map(Number).filter(Boolean);
    console.log("[GET /products] sizes raw:", req.query.sizes ?? req.query.size);
    console.log("[GET /products] sizeIds:", sizeIds);
    // colors: "trắng,đỏ" (FE gửi keyword TV)
    const colorKeywords = String(req.query.colors || "")
      .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

    const colorTokens = expandColorTokens(colorKeywords);
    const hasColorFilter = colorTokens.length > 0;
    const colorWhere = buildColorWhere(colorTokens); // where object (không literal)

    // --- Parse prices an toàn: loại NaN, rác, range ngược ---
    const rawPrices = String(req.query.prices || "").trim();
    const priceRanges = rawPrices
      .split(",")
      .map((r) => {
        const [minStr = "", maxStr = ""] = r.split("-");
        const min = Number(minStr);
        // Nếu maxStr rỗng => không có trần; nếu là 'NaN' hay rác => coi như null
        const max =
          maxStr === "" ? null : (Number.isFinite(Number(maxStr)) ? Number(maxStr) : null);
        return { min, max };
      })
      // chỉ giữ range hợp lệ: min là số hữu hạn, và (max null hoặc số hữu hạn ≥ min)
      .filter((r) => Number.isFinite(r.min) && (r.max === null || (Number.isFinite(r.max) && r.max >= r.min)));


    // Include Variants
    const needVariantInnerJoin =
      collarIds.length > 0 || sizeIds.length > 0 || hasColorFilter;

    const variantInclude = {
      model: ProductVariantModel,
      as: "variants",
      required: needVariantInnerJoin,
      include: [
        { model: ShoeHeightModel, as: "shoe_height", attributes: ["id", "name"] },
        {
          model: VariantSizeModel,
          as: "product_variant_sizes",
          required: sizeIds.length > 0,
          attributes: ["stock"],
          ...(sizeIds.length > 0 && {
            where: { size_id: { [Op.in]: sizeIds } }
          }),
          include: [{ model: SizeModel, as: "size", attributes: ["id", "size"] }],
        }
        ,
        {
          model: ColorModel,
          as: "color",
          attributes: ["id", "color_name"],
          ...(hasColorFilter && { where: colorWhere, required: true }),
        },
      ],
      ...(collarIds.length > 0 && { where: { shoe_height_id: { [Op.in]: collarIds } } }),
    };

    // WHERE cấp Product
    const productWhere = {
      status: 1,
      ...(searchQuery && { name: { [Op.like]: `%${searchQuery}%` } }),
      ...(brandIds.length && { brand_id: { [Op.in]: brandIds } }),
      ...(categoryIds.length && { category_id: { [Op.in]: categoryIds } }),
      ...(genderIds.length && { gender_id: { [Op.in]: genderIds } }),
      ...(priceRanges.length && {
        [Op.or]: priceRanges.map((r) =>
          r.max != null
            ? { price_sale: { [Op.between]: [r.min, r.max] } }
            : { price_sale: { [Op.gte]: r.min } }
        ),
      }),
    };

    // ✅ THÊM KHỐI NÀY NGAY SAU productWhere
    if (sizeIds.length) {
      productWhere[Op.and] = productWhere[Op.and] || [];
      productWhere[Op.and].push(
        Sequelize.literal(`
      EXISTS (
        SELECT 1
        FROM product_variants pv
        JOIN variant_sizes vs ON vs.variant_id = pv.id
        WHERE pv.product_id = products.id
          AND vs.size_id IN (${sizeIds.join(",")})
      )
    `)
      );
    }


    // Query
    const products = await ProductModel.findAll({
      where: productWhere,
      order: [["created_at", "desc"]],
      include: [
        variantInclude,
        { model: CategoryModel, as: "category", attributes: ["name"] },
        // {
        //   model: VariantSizeModel,
        //   as: "product_variant_sizes",
        //   required: sizeIds.length > 0,
        // },
        { model: GenderModel, as: "gender", attributes: ["id", "name"] },
        { model: BrandModel, as: "brand", attributes: ["name"] },
      ],
      distinct: true,
    });

    res.json(products);
  } catch (err) {
    console.error("getAllProducts error:", {
      message: err.message,
      code: err.parent?.code,
      sqlMessage: err.parent?.sqlMessage,
      sql: err.parent?.sql,
      stack: err.stack,
    });
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm" });
  }
};

/* ======================================================================
   2) GET /products/:slug
   ====================================================================== */
exports.getProductBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await ProductModel.findOne({
      where: { slug },
      include: [
        {
          model: ProductVariantModel,
          as: "variants",
          include: [
            { model: ProductImageModel, as: "images" },
            { model: ColorModel, as: "color" },
            {
              model: VariantSizeModel,
              as: "product_variant_sizes",
              attributes: ["stock"],
              include: [{ model: SizeModel, as: "size", attributes: ["id", "size"] }],
            },
          ],
        },
        { model: CategoryModel, as: "category", attributes: ["name"] },
        { model: BrandModel, as: "brand", attributes: ["name"] },
      ],
    });
    res.json({ product });
  } catch (err) {
    console.error("getProductBySlug error:", err);
    res.status(500).json({ error: "Lỗi khi lấy chi tiết sản phẩm" });
  }
};

/* ======================================================================
   3) GET /products/by-category/:id
   ====================================================================== */
exports.getProductByCategory = async (req, res) => {
  try {
    const products = await ProductModel.findAll({
      where: { category_id: req.params.id, status: 1 },
      order: [
        ["created_at", "DESC"],
        ["price", "ASC"],
      ],
      include: [{ model: CategoryModel, as: "category", attributes: ["name"] }],
    });
    res.json(products);
  } catch (err) {
    console.error("getProductByCategory error:", err);
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm theo danh mục" });
  }
};

/* ======================================================================
   4) GET /products/hot/:count?
   ====================================================================== */
exports.getHotProducts = async (req, res) => {
  try {
    const count = Number(req.params.count) || 12;
    const products = await ProductModel.findAll({
      where: { status: 1, hot: 1 },
      order: [
        ["created_at", "DESC"],
        ["id", "DESC"],
      ],
      include: [{ model: CategoryModel, as: "category", attributes: ["name"] }],
      limit: count,
    });
    res.json(products);
  } catch (err) {
    console.error("getHotProducts error:", err);
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm hot" });
  }
};

/* ======================================================================
   5) GET /products/most-view/:count?
   ====================================================================== */
exports.getMostViewed = async (req, res) => {
  try {
    const count = Number(req.params.count) || 4;
    const products = await ProductModel.findAll({
      where: { status: 1, view: { [Op.gt]: 50 } },
      order: [
        ["created_at", "DESC"],
        ["id", "DESC"],
      ],
      include: [{ model: CategoryModel, as: "category", attributes: ["name"] }],
      limit: count,
    });
    res.json(products);
  } catch (err) {
    console.error("getMostViewed error:", err);
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm xem nhiều" });
  }
};

/* ======================================================================
   6) GET /products/new/:count?
   ====================================================================== */
exports.getNewProducts = async (req, res) => {
  try {
    const count = Number(req.params.count) || 8;
    const products = await ProductModel.findAll({
      where: { status: 1 },
      order: [
        ["created_at", "DESC"],
        ["id", "DESC"],
      ],
      include: [{ model: CategoryModel, as: "category", attributes: ["name"] }],
      limit: count,
    });
    res.json(products);
  } catch (err) {
    console.error("getNewProducts error:", err);
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm mới" });
  }
};

/* ======================================================================
   7) GET /products/search?q=...
   ====================================================================== */
exports.searchProducts = async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const rows = await ProductModel.findAll({
      where: q ? { name: { [Op.like]: `%${q}%` }, status: 1 } : { status: 1 },
      order: [["created_at", "DESC"]],
      limit: 50,
    });
    res.json(rows);
  } catch (err) {
    console.error("searchProducts error:", err);
    res.status(500).json({ message: "Lỗi truy vấn database" });
  }
};

exports.getProductsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ where: { slug } });
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    const products = await Product.findAll({
      where: { category_id: category.id },
      include: [{ model: Category, attributes: ["name", "slug"] }],
    });

    res.json({ category, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
