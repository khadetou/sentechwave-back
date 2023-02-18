import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateTagsDto } from './dto/create-tags.dto';
import { Tags } from './schema/tags-schema';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // CREATE TAGS
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async createtags(@Body() createtags: CreateTagsDto): Promise<Tags> {
    return await this.tagsService.createTags(createtags);
  }

  //   GET ALL TAGS
  @Get()
  async getAllTags(): Promise<Tags[]> {
    return await this.tagsService.getAllTags();
  }

  //   GET TAGS BY SLUG
  @Get('/:slug')
  async getTagsBySlug(@Param('slug') slug: string): Promise<Tags> {
    return await this.tagsService.getTags(slug);
  }

  // DELETE TAGS

  @Delete('/:slug')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async deleteTags(@Param('slug') slug: string): Promise<{ message: string }> {
    return await this.tagsService.deleteTags(slug);
  }
}
