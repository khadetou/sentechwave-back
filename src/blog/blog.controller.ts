import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decoration';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { User } from 'src/auth/schema/user.schema';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog-dto';
import { UpdateBlogDto } from './dto/update-blog-dto';
import { Blog } from './schema/blog-schema';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // CREATE BLOG

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @GetUser() user: User,
  ): Promise<Blog> {
    return await this.blogService.createBlog(createBlogDto, user);
  }

  // GET ALL BLOG
  @Get()
  async getAllBlog(): Promise<Blog[]> {
    return await this.blogService.getAllBlogs();
  }

  // GET BLOG BY SLUG
  @Get('/:slug')
  async getBlog(@Param('slug') slug: string): Promise<Blog> {
    return await this.blogService.getBlogBySlug(slug);
  }

  // UPDATE BLOG
  @Put('/:slug')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async updateBlog(
    @Param('slug') slug: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(updateBlogDto, slug);
  }

  // DELETE BLOG
  @Delete('/:slug')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async deleteBlog(@Param('slug') slug: string): Promise<Blog> {
    return await this.blogService.deleteBlog(slug);
  }
}
