const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');
const ProductVariant = require('./ProductVariant'); // ⬅ KHÔNG được thiếu
const SizeModel = require('./Size')

const CartModel = sequelize.define('cart_item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  variant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  size_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  create_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cart_items',
  timestamps: true
});

// ✅ Khai báo liên kết tại đây
CartModel.belongsTo(ProductVariant, {
  foreignKey: 'variant_id',
  as: 'variant'
});

CartModel.belongsTo(SizeModel, {
  foreignKey: 'size_id',
  as: 'size', // tên này phải đúng như trong include
});
module.exports = CartModel;