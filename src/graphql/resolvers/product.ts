import connection from '../../db';

type ProductCreateInput = {
  product: {
    name: string;
  };
};

type ProductUpdateInput = {
  id: number;
  product: {
    name: string;
  };
};

const productQueries = {
  products: async (_: any, args: any) => {
    const products = await connection('Product')
      .select('*')
      .where('Product.seller_id', args.sellerID)
      .join('ProductImage', 'Product.id', '=', 'ProductImage.product_id');

    return products.map((product) => ({
      id: product.id,
      sellerID: product.seller_id,
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      imageURI: product.image_uri,
    }));
  },
  product: async (_: any, args: any) => {
    const products = await connection('Product')
      .select('*')
      .where('Product.id', args.productID)
      .join('ProductImage', 'Product.id', '=', 'ProductImage.product_id');

    console.log(products);

    return products.map((product) => ({
      id: product.id,
      sellerID: product.seller_id,
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      imageURI: product.image_uri,
    }))[0];
  },
};

const productMutations = {
  createProduct: async (parent: undefined, args: ProductCreateInput) => {
    // const product = await ProductModel.create(args.product);
    // return product;
  },
  updateProduct: async (_: any, args: ProductUpdateInput) => {
    // const product = await ProductModel.findByIdAndUpdate(args.id, args.product);
    // return product;
  },
};

export { productQueries, productMutations };
