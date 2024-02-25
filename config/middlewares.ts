export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::flatten-response',
  'global::admin-login',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'kkiri-strapi.s3.ap-northeast-2.amazonaws.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'kkiri-strapi.s3.ap-northeast-2.amazonaws.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
