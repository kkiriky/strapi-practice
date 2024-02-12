export default {
  routes: [
    {
      // Path defined with a URL parameter
      method: 'GET',
      path: '/articles/search',
      handler: 'article.search',
      config: {
        auth: false,
        middlewares: ['api::article.format-image'],
      },
    },
    {
      // Path defined with a URL parameter
      method: 'GET',
      path: '/articles/pagination',
      handler: 'article.getPaginatedArticles',
      config: {
        auth: false,
        middlewares: ['api::article.format-image'],
      },
    },
  ],
};
