import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Tags, TagsSchema } from './schema/tags-schema';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tags.name,
        schema: TagsSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
