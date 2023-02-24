import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v2 } from 'cloudinary';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateReviewsDto } from './dto/create-review.dto';
import { GetProductsFilterDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-produt.dto';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  //GET ALL PRODUCTS
  async getProducts(getProductsFilterDto: GetProductsFilterDto): Promise<any> {
    let { pageSize, keyword, category, souscategory, ssouscategory } =
      getProductsFilterDto;
    const { pageNumber, min, max } = getProductsFilterDto;

    pageSize = 8;
    const page = Number(pageNumber) || 1;

    keyword = keyword
      ? {
          name: { $regex: keyword, $options: 'i' },
        }
      : {};

    category = category ? { category: category } : {};
    souscategory = souscategory ? { souscategory: souscategory } : {};
    ssouscategory = ssouscategory ? { ssouscategory: ssouscategory } : {};
    // ssouscategory = ssouscategory
    //   ? { ssouscategory: { $regex: ssouscategory, $options: '^' } }
    //   : {};

    const price =
      min && max ? { price: { $gte: Number(min), $lte: Number(max) } } : {};

    const count = await this.productModel.countDocuments({
      $and: [keyword, category, souscategory, ssouscategory, price],
    });
    const products = await this.productModel
      .find({
        $and: [keyword, category, souscategory, ssouscategory, price],
      })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  //CREATE PRODUCT
  async createProduct(
    createProductDto: CreateProductDto,
    user: any,
  ): Promise<Product> {
    const {
      name,
      images,
      brand,
      category,
      description,
      specification,
      rating,
      price,
      oldPrice,
      sizes,
      colors,
      sku,
      styles,
      subsubcategory,
      subcategory,
      countInStock,
    } = createProductDto;
    const imageLinks: any[] = [];

    if (images) {
      for (let i = 0; i < images.length; i++) {
        const upload = await v2.uploader.upload(images[i], {
          folder: `sentechwave/products/${category}`,
        });

        imageLinks.push({
          public_id: upload.public_id,
          url: upload.secure_url,
          format: upload.format,
          width: upload.width,
          height: upload.height,
        });
      }
    }

    const productField = {
      user: user._id,
      name: name && name,
      sku: sku && sku,
      images: imageLinks,
      brand: brand && brand,
      category: category !== '' ? category : undefined,
      subcategory: subcategory !== '' ? subcategory : undefined,
      subsubcategory: subsubcategory !== '' ? subsubcategory : undefined,
      description: description && description,
      specification: specification && specification,
      rating: rating && rating,
      sizes: sizes && sizes,
      colors: colors && colors,
      styles: styles && styles,
      price: price && price,
      oldPrice: oldPrice && oldPrice,
      countInStock: countInStock && countInStock,
    };

    const product = new this.productModel(productField);

    try {
      return await product.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // UPDATE PRODUCT
  async updateProduct(
    updateProductDto: UpdateProductDto,
    id: string,
  ): Promise<Product> {
    const {
      name,
      images,
      brand,
      category,
      description,
      specification,
      subcategory,
      subsubcategory,
      rating,
      price,
      sku,
      sizes,
      colors,
      styles,
      countInStock,
      oldPrice,
    } = updateProductDto;

    const product = await this.productModel.findById(id);

    const imageLinks: any = [];

    if (images.length !== 0) {
      for (let i = 0; product.images.length > i; i++) {
        await v2.uploader.destroy(product.images[i].public_id);
      }

      for (let i = 0; i < images.length; i++) {
        const upload = await v2.uploader.upload(images[i], {
          folder: `sentechwave/products/${category}`,
        });

        imageLinks.push({
          public_id: upload.public_id,
          url: upload.secure_url,
          format: upload.format,
          width: upload.width,
          height: upload.height,
        });
      }
    }

    if (product) {
      product.name = name || product.name;
      product.sku = sku && product.sku;
      product.images = imageLinks.length !== 0 ? imageLinks : product.images;
      product.brand = brand || brand;
      product.category = category || product.category;
      product.description = description || product.description;
      product.specification = specification || product.specification;
      product.subcategory = subcategory || product.subcategory;
      product.subsubcategory = subsubcategory || product.subsubcategory;
      product.rating = rating || product.rating;
      product.price = price || product.price;
      product.sizes = sizes || product.sizes;
      product.styles = styles || product.styles;
      product.colors = colors || product.colors;
      product.oldPrice = oldPrice || product.oldPrice;
      product.countInStock = countInStock || product.countInStock;
    } else {
      throw new NotFoundException('Product not found');
    }

    try {
      return await product.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  //CREATE REVIEWS

  async createReviews(
    createReviewsDto: CreateReviewsDto,
    id: string,
    user: any,
  ): Promise<Product> {
    const product = await this.productModel.findById(id);
    const { rating, comment } = createReviewsDto;

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === user._id.toString(),
      );

      if (alreadyReviewed) {
        throw new InternalServerErrorException(
          'Vous avez dèjas donné votre avis sur ce produit !',
        );
      }

      product.reviews.push({
        user: user._id,
        name: user.firstname + ' ' + user.lastname,
        rating: Number(rating),
        comment: comment,
      });
      product.numbReviews = product.reviews.length;
      product.rating =
        product.reviews.reduceRight((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      try {
        return await product.save();
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    } else {
      throw new InternalServerErrorException('Product not found');
    }
  }

  //GET PRODUCT BY ID

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .populate('subcategory')
      .exec();
    if (product) {
      return product;
    } else {
      throw new InternalServerErrorException('Product not found');
    }
  }

  //DELETE PRODUCT
  async deleteProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (product) {
      for (let i = 0; product.images.length > i; i++) {
        await v2.uploader.destroy(product.images[i].public_id);
      }
      return await product.remove();
    } else {
      throw new InternalServerErrorException('Product not found');
    }
  }

  //GET TOP RATED PRODUCTS
  async getTopRatedProducts(): Promise<Product[]> {
    const products = await this.productModel
      .find({})
      .sort({ rating: -1 })
      .limit(3);
    return products;
  }
}
