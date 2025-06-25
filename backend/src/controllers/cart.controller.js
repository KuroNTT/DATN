const CartModel = require('../models/cart');
const ProductVariantModel = require('../models/ProductVariant');
const ProductModel = require('../models/Product');

const addToCart = (req, res) => {
  const cart = req.body;
  res.json(cart);
};

const deleteCartById = (req, res) => {
  const cart = req.body;
  res.json(cart);
};

const getAllCart = async (req, res) => {
  try {
    const cartItems = await CartModel.findAll({
      where: { user_id: req.params.userId },
      include: [
        {
          model: ProductVariantModel,
          as: 'variant',
          attributes: ['id', 'image_url'],
          include: [
            {
              model: ProductModel,
              as: 'product',
              attributes: ['name', 'price', 'description', 'image']
            }
          ]
        }
      ]
    });

    res.json(cartItems);
  } catch (err) {
    console.error('❌ Lỗi khi lấy giỏ hàng:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  addToCart,
  getAllCart
};
