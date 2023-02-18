import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v2 } from 'cloudinary';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { CreateBlogDto } from './dto/create-blog-dto';
import { Blog, BlogDocument } from './schema/blog-schema';
import { smartrim } from './smartTrim';

// import stripTags from 'striptags';
import { UpdateBlogDto } from './dto/update-blog-dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  // CREATE BLOG
  async createBlog(createBlogDto: CreateBlogDto, user: any): Promise<Blog> {
    const { title, body, image, category, tags, mdesc } = createBlogDto;
    let img: any = {};
    if (image !== '') {
      const upload = await v2.uploader.upload(image, {
        folder: `marchesn/blog/${title}`,
      });
      img = {
        public_id: upload.public_id,
        url: upload.secure_url,
        width: upload.width,
        height: upload.height,
        format: upload.format,
      };
    }

    const arrayOfCategories = category && category.split(',');
    const arrayOfTags = tags && tags.split(',');

    const blog = new this.blogModel({
      title,
      body,
      excerpt: smartrim(body, 320, ' ', ' ...'),
      slug: slugify(title).toLowerCase(),
      mdesc,
      image: img,
      category: arrayOfCategories,
      tags: arrayOfTags,
      user: user._id,
    });

    try {
      // const blg = await blog.save();
      // await this.blogModel.findByIdAndUpdate(blg._id, {
      //   $push: { category: arrayOfCategories },
      // });
      // await this.blogModel.findByIdAndUpdate(blg._id, {
      //   $push: { tags: arrayOfTags },
      // });

      return await blog.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //   GET ALL BLOGS
  async getAllBlogs(): Promise<Blog[]> {
    return await this.blogModel
      .find({})
      .populate('category', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('user', '_id firstname lastname');
  }

  //   GET BLOGS TAGS && CATEGORIES
  // async getAllBlogsCategoriesTags():Promise<Blog[]>{

  // }

  //  GET BLOG BY SLUG
  async getBlogBySlug(slug: string): Promise<Blog> {
    const slugy = slug.toLowerCase();
    try {
      return await this.blogModel
        .findOne({ slug: slugy })
        .populate('category', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('user', '_id firstname lastname');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // DELETE BLOG
  async deleteBlog(slug: string): Promise<Blog> {
    const slugy = slug.toLowerCase();

    try {
      const blog = await this.blogModel.findOne({ slug: slugy });
      if (blog) {
        if (blog.image.public_id) {
          await v2.uploader.destroy(blog.image.public_id);
        }
        return await blog.remove();
      }
    } catch (error) {}
  }

  //   UPDATE BLOG
  async updateBlog(updateBlogDto: UpdateBlogDto, slug: string): Promise<Blog> {
    const slugy = slug.toLowerCase();
    const { body, category, image, tags, title, mdesc } = updateBlogDto;

    let imageData: any = {};
    const blog = await this.blogModel.findOne({ slugy }).exec();
    console.log(blog.image);
    if (blog.image.public_id && image !== '') {
      await v2.uploader.destroy(blog.image.public_id);
      const upload = await v2.uploader.upload(image, {
        folder: `marchesn/blog/${title}`,
      });

      imageData.format = upload.format;
      imageData.height = upload.height;
      imageData.public_id = upload.public_id;
      imageData.url = upload.secure_url;
      imageData.width = upload.width;
      blog.image = imageData;
    }

    if (blog) {
      blog.title = title || blog.title;
      blog.excerpt = smartrim(body, 320, ' ', ' ...') || blog.excerpt;
      blog.category = (category && category.split(',')) || blog.category;
      blog.tags = (tags && tags.split(',')) || blog.tags;
      blog.mdesc = mdesc || blog.mdesc;
    } else {
      throw new NotFoundException('Blog not found');
    }
    try {
      return await blog.save();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
