/**
 * article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::article.article',
  ({ strapi }) => ({
    // createdBy와 updatedBy는 admin의 foreign key이므로 일반 authenticated user는 relation 설정이 불가
    // 따라서 Strapi 생성 시 자동으로 생성되는 User Entity와 relation을 설정하여
    // rest api 요청 시 relation을 직접 연결해줘야 함
    // * Strapi에서 자동으로 생성되는 User Entity를 이용하면 회원가입/로그인/인증을 직접 구현할 필요가 없으므로 이를 이용하기 위함
    async create(ctx) {
      const user = ctx.state.user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { body } = ctx.request as any;

      const result = await strapi.entityService.create('api::article.article', {
        data: {
          ...body.data,
          user: {
            connect: [{ id: user.id }],
          },
        },
      });

      return result;
    },

    async search(ctx) {
      try {
        await this.validateQuery(ctx);
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const keyword = sanitizedQueryParams.keyword as string;

        const result = await strapi.entityService.findMany(
          'api::article.article',
          {
            populate: '*',
            filters: {
              $or: [
                {
                  title: {
                    $containsi: keyword,
                  },
                },
                {
                  content: {
                    $containsi: keyword,
                  },
                },
              ],
            },
          }
        );

        ctx.body = { data: result };
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
