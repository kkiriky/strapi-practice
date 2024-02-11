import { Context, Next } from 'koa';
import { ArticleEntity } from '../../../entities/article.entity';
import { plainToClass } from 'class-transformer';
import { ImageEntity } from '../../../entities/image.entity';

interface ExtendedContext extends Context {
  body: {
    data: ArticleEntity[] | ArticleEntity;
  };
}

export default () => {
  return async (ctx: ExtendedContext, next: Next) => {
    await next();

    if (Array.isArray(ctx.body.data)) {
      // 응답 데이터가 list 형태일 경우 (ex. find)
      ctx.body.data = ctx.body.data.map((article) => {
        return {
          ...article,
          thumbnail: plainToClass(ImageEntity, article.thumbnail),
        };
      });
    } else {
      // 응답 데이터가 list 형태가 아닐 경우 (ex. findOne)
      ctx.body.data = {
        ...ctx.body.data,
        thumbnail: plainToClass(ImageEntity, ctx.body.data.thumbnail),
      };
    }
  };
};
