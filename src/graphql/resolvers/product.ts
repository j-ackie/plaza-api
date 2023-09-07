import { ObjectId } from 'mongoose';
import { ProductModel } from '../../models';

type ProductCreateInput = {
  product: {
    name: string;
  };
};

type ProductUpdateInput = {
  id: ObjectId;
  product: {
    name: string;
  };
};

const productQueries = {
  products: async (_: any, args: any) => {},
  product: async (_: any, args: any) => {},
};

const productMutations = {
  createProduct: async (parent: undefined, args: ProductCreateInput) => {
    const product = await ProductModel.create(args.product);
    return product;
  },
  updateProduct: async (_: any, args: ProductUpdateInput) => {
    const product = await ProductModel.findByIdAndUpdate(args.id, args.product);
    return product;
  },
};

export { productQueries, productMutations };
