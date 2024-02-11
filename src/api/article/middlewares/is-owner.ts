import { Context, Next } from 'koa';
import { UserEntity } from '../../../entities/user.entity';

interface ExtendedContext extends Context {
  state: {
    user: UserEntity;
  };
}

export default () => {
  return async (ctx: ExtendedContext, next: Next) => {
    const user = ctx.state.user;
    const articleId = ctx.params.id ? ctx.params.id : undefined;

    if (!user) return ctx.unauthorized('권한이 없습니다.');
    if (!articleId) return ctx.badRequest('잘못된 요청입니다.');

    const article = await strapi.entityService.findOne(
      'api::article.article',
      articleId,
      { populate: '*' }
    );

    if (user.id !== article.user.id) {
      return ctx.unauthorized('권한이 없습니다.');
    }

    return next();
  };
};
