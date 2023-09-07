import { Schema, model, ObjectId } from 'mongoose';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const ProductModel = model('Product', ProductSchema);

export default ProductModel;
