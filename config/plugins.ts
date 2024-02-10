export default () => ({
  // https://github.com/ComfortablyCoding/strapi-plugin-transformer
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
      hooks: {
        postResponseTransform: (ctx) => {
          const { data, meta } = ctx.response.body;

          /*  meta에 pagination 외의 다른 정보가 들어가는 경우가 있다면 이 방식은 사용 X */
          // 페이지네이션에 응답일 경우 meta.pagination 제거
          // Before: meta.pagination.page, meta.pagination.pageSize, meta.pagination.pageCount, meta.pagination.total
          // After: meta.page, meta.pageSize, meta.pageCount, meta.total
          if (Object.keys(meta).length && meta.pagination) {
            ctx.response.body = {
              data,
              meta: meta.pagination,
            };
            return;
          }

          // 페이지네이션 응답이 아닌 경우에는 data, meta 제거
          ctx.response.body = ctx.response.body.data;
        },
      },
    },
  },
});
