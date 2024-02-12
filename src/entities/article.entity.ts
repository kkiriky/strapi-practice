import { Attribute } from '@strapi/strapi';
import { Exclude, Type } from 'class-transformer';
import { AdminEntity } from './admin.entity';
import { ImageEntity } from './image.entity';
import { UserEntity } from './user.entity';

export class ArticleEntity {
  constructor(
    partial:
      | Attribute.GetValues<
          'api::article.article',
          | Attribute.GetNonPopulatableKeys<'api::article.article'>
          | Attribute.GetPopulatableKeys<'api::article.article'>
        >
      | Partial<ArticleEntity>
  ) {
    Object.assign(this, partial);
  }

  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  @Type(() => ImageEntity)
  thumbnail: ImageEntity;
  @Type(() => UserEntity)
  user?: UserEntity;
  @Exclude()
  createdBy?: AdminEntity;
  @Exclude()
  updatedBy?: AdminEntity;
}
