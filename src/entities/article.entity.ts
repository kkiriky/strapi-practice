import { ImageEntity } from './image.entity';

export class ArticleEntity {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  thumbnail: ImageEntity;
}
