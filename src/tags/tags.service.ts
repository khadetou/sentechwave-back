import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagsDto } from './dto/create-tags.dto';
import { Tags, TagsDocument } from './schema/tags-schema';
import slugify from 'slugify';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tags.name)
    private readonly tagsModel: Model<TagsDocument>,
  ) {}

  //    CREATE TAG
  async createTags(createProductDto: CreateTagsDto): Promise<Tags> {
    const { name } = createProductDto;
    let slug = slugify(name).toLowerCase();

    const tags = new this.tagsModel({
      name,
      slug,
    });

    try {
      return await tags.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //    GET ALL TAGS
  async getAllTags(): Promise<Tags[]> {
    try {
      return await this.tagsModel.find({}).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //   GET BY TAG SLUG
  async getTags(slug: string): Promise<Tags> {
    const slugy = slug.toLowerCase();

    try {
      return await this.tagsModel.findOne({ slug: slugy });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //   REMOVE TAG
  async deleteTags(slug: string): Promise<{ message: string }> {
    const slugy = slug.toLowerCase();
    try {
      return await this.tagsModel.findOneAndRemove({ slug: slugy });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
