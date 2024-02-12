import { Next, DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import { plainToClass } from 'class-transformer';
import { ArticleEntity } from '../../../entities/article.entity';
import { StrapiError } from '../../../types/error.types';

type ExtendedContext = ParameterizedContext<
  DefaultState,
  DefaultContext,
  { data: ArticleEntity[] | ArticleEntity; error: StrapiError }
>;

export default () => {
  return async (ctx: ExtendedContext, next: Next) => {
    await next();

    if (ctx.body.data) {
      if (Array.isArray(ctx.body.data)) {
        // 응답 데이터가 list 형태일 경우 (ex. find)
        ctx.body.data = ctx.body.data.map((article) => {
          return plainToClass(ArticleEntity, article);
        });
      } else {
        ctx.body.data = plainToClass(ArticleEntity, ctx.body.data);
      }
    }
  };
};
