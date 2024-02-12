import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';

type ExtendedContext = ParameterizedContext<
  DefaultState,
  DefaultContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { data: any; meta?: any }
>;

export default ({ env }) => ({
  // https://github.com/ComfortablyCoding/strapi-plugin-transformer
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
      hooks: {
        postResponseTransform: (ctx: ExtendedContext) => {
          const { data, meta } = ctx.response.body;

          // 페이지네이션에 응답일 경우 meta.pagination 제거
          // Before: meta.pagination.page, meta.pagination.pageSize, meta.pagination.pageCount, meta.pagination.total
          // After: meta.page, meta.pageSize, meta.pageCount, meta.total
          if (meta && Object.keys(meta).length && meta.pagination) {
            ctx.response.body = {
              data,
              meta: meta.pagination,
            };
            return;
          }

          // 페이지네이션 응답이 아닌 경우에는 meta 제거
          ctx.response.body = {
            data: ctx.response.body.data,
          };
        },
      },
    },
  },
  upload: {
    config: {
      provider: 'aws-s3', // For community providers pass the full package name (e.g. provider: 'strapi-provider-upload-google-cloud-storage')
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
        region: env('AWS_REGION'),
        params: {
          ACL: env('AWS_ACL', 'private'), // 'private' if you want to make the uploaded files private
          Bucket: env('AWS_BUCKET_NAME'),
        },
      },
    },
  },
});
