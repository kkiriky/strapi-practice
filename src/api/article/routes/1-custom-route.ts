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
  ],
};
