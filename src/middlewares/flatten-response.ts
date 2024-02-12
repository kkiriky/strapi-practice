import { DefaultContext, DefaultState, ParameterizedContext, Next } from 'koa';
import { flattenResponse } from '../utils/flattenResponse';

type ExtendedContext = ParameterizedContext<
  DefaultState,
  DefaultContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { data: any; meta?: any }
>;

export default () => async (ctx: ExtendedContext, next: Next) => {
  await next();

  if (!ctx.url.startsWith('/api')) return;

  const data = flattenResponse(ctx.response.body.data);
  const meta = ctx.response.body.meta;

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
};
