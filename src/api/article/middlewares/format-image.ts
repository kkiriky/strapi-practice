import { Context, Next } from 'koa';
import { ArticleEntity } from '../../../entities/article.entity';
import { plainToClass } from 'class-transformer';
import { ImageEntity } from '../../../entities/image.entity';
import { StrapiError } from '../../../types/error.types';

interface ExtendedContext extends Context {
  body: {
    data: ArticleEntity[] | ArticleEntity;
    error: StrapiError;
  };
}

export default () => {
  return async (ctx: ExtendedContext, next: Next) => {
    await next();

    // is-owner 미들웨어에서 throw error 했을 경우 body에 data없이 error만 존재하므로 넘김
    if (ctx.body.error) return;

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
