/**
 * article router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article', {
  config: {
    find: {
      middlewares: ['api::article.format-image'],
    },
    findOne: {
      middlewares: ['api::article.format-image'],
    },
    update: {
      middlewares: ['api::article.format-image', 'api::article.is-owner'],
    },
    delete: {
      middlewares: ['api::article.is-owner'],
    },
  },
});
