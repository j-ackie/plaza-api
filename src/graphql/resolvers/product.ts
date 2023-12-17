import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import connection from '../../db';
import crypto from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import client from '../../s3';

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
  product: async (_: any, args: any) => {
    const product = await connection('Product')
      .select('*')
      .where('Product.id', args.id)
      .leftJoin('ProductImage', 'Product.id', '=', 'ProductImage.product_id');

    const productImageBucketKeys = product.map((p) => p.bucket_key);
    const productImageURIs = productImageBucketKeys.map(async (bucketKey) => {
      const command = new GetObjectCommand({
        Bucket: 'plaza-videos-images',
        Key: bucketKey,
      });

      const presignedUrl = await getSignedUrl(client, command, {
        expiresIn: 3600,
      });

      return presignedUrl;
    });

    const productObject = product[0];

    return {
      id: productObject.product_id,
      sellerID: productObject.seller_id,
      name: productObject.name,
      description: productObject.description,
      quantity: productObject.quantity,
      price: productObject.price,
      imageURIs: productImageURIs,
    };
  },
  products: async (_: any, args: any) => {
    const products = await connection('Product')
      .select('*')
      .where('Product.seller_id', args.sellerID)
      .leftJoin('ProductImage', 'Product.id', '=', 'ProductImage.product_id');

    const groupedProducts: any = {};

    await Promise.all(
      products.map(async (product) => {
        if (!groupedProducts[product.product_id]) {
          groupedProducts[product.product_id] = {
            id: product.product_id,
            sellerID: product.seller_id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            imageURIs: [],
          };
        }

        if (product.bucket_key) {
          const command = new GetObjectCommand({
            Bucket: 'plaza-videos-images',
            Key: product.bucket_key,
          });

          const presignedUrl = await getSignedUrl(client, command, {
            expiresIn: 3600,
          });
          groupedProducts[product.product_id].imageURIs.push(presignedUrl);
        }
      })
    );

    return Object.values(groupedProducts);
  },
};

const productMutations = {
  createProduct: async (parent: undefined, args: any, ctx: any) => {
    const bucketKey = crypto.randomBytes(32).toString('hex');
    const command = new PutObjectCommand({
      Bucket: 'plaza-videos-images',
      Key: bucketKey,
    });
    const presignedUrl = await getSignedUrl(client, command, { expiresIn: 60 });

    const insertedObject = await connection.transaction(async (trx) => {
      const insertedProductObject = (
        await trx('Product')
          .insert({
            seller_id: ctx.user.id,
            name: args.product.name,
            description: args.product.description,
            quantity: args.product.quantity,
            price: args.product.price,
          })
          .returning('*')
      )[0];

      await trx('ProductImage').insert({
        product_id: insertedProductObject.id,
        bucket_key: bucketKey,
      });

      return insertedProductObject;
    });

    return {
      id: insertedObject.id,
      sellerID: insertedObject.seller_id,
      name: insertedObject.name,
      description: insertedObject.description,
      quantity: insertedObject.quantity,
      price: insertedObject.price,
      imageURIs: [presignedUrl],
    };
  },
  updateProduct: async (_: any, args: ProductUpdateInput) => {},
};

export { productQueries, productMutations };
