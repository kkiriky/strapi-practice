/**
 * article controller
 */

import { factories } from '@strapi/strapi';
import { ArticleEntity } from '../../../entities/article.entity';
import { plainToClass } from 'class-transformer';

export default factories.createCoreController(
  'api::article.article',
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const user = ctx.state.user;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { body } = ctx.request as any;

        const result = await strapi.entityService.create(
          'api::article.article',
          {
            data: {
              ...body.data,
              user: {
                connect: [{ id: user.id }],
              },
            },
          }
        );

        return result;
      } catch (err) {
        ctx.body = err;
      }
    },

    // Custom Controller
    async search(ctx) {
      try {
        await this.validateQuery(ctx);
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const keyword = sanitizedQueryParams.keyword as string;

        if (!keyword) {
          return (ctx.body = { data: null });
        }

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

        ctx.body = {
          data: result.map((article) => plainToClass(ArticleEntity, article)),
        };
      } catch (err) {
        ctx.body = err;
      }
    },

    async getPaginatedArticles(ctx) {
      try {
        await this.validateQuery(ctx);
        const sanitizedQueryParams = (await this.sanitizeQuery(ctx)) as Record<
          string,
          string
        >;
        const page = sanitizedQueryParams.page ?? 1;
        const pageSize = sanitizedQueryParams.pageSize ?? 10;

        const result = await strapi.entityService.findPage(
          'api::article.article',
          {
            populate: '*',
            page: +page,
            pageSize: +pageSize,
          }
        );

        ctx.body = {
          data: result.results,
          meta: {
            pagination: result.pagination,
          },
        };
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
