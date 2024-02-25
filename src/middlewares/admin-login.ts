import type {
  DefaultContext,
  DefaultState,
  ParameterizedContext,
  Next,
} from 'koa';
import passport from 'koa-passport';
import { errors } from '@strapi/utils';
import { Login } from '@strapi/admin/dist/shared/contracts/authentication';

const { ApplicationError } = errors;

const getService = (name: string) => {
  return strapi.service(`admin::${name}`);
};

type ExtendedContext = ParameterizedContext<
  DefaultState,
  DefaultContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { data: any; meta?: any }
>;

export default () => async (ctx: ExtendedContext, next: Next) => {
  // community edition에서는 /admin/login 의 controller를 열어주지 않기 때문에
  // global router에서 hacky한 방식으로 처리
  // 기존의 /admin/login의 비지니스 로직을 알아야만 2FA를 추가적으로 구현할 수 있음
  // 오픈소스이므로 반드시 strapi 레퍼지토리에 코드가 존재함 => 이를 찾아서 어떻게 커스텀할지 고민이 필요

  // 1. admin route 경로: packages/core/admin/server/src/routes/authentication.ts
  // https://github.com/strapi/strapi/blob/develop/packages/core/admin/server/src/routes/authentication.ts

  // 2. admin controller 경로: packages/core/admin/server/src/controllers/authentication.ts
  // https://github.com/strapi/strapi/blob/develop/packages/core/admin/server/src/controllers/authentication.ts
  if (ctx.url === '/admin/login') {
    return passport.authenticate(
      'local',
      { session: false },
      (err, user, info) => {
        // 에러 핸들링
        if (err) {
          strapi.eventHub.emit('admin.auth.error', {
            error: err,
            provider: 'local',
          });
          // if this is a recognized error, allow it to bubble up to user
          if (err.details?.code === 'LOGIN_NOT_ALLOWED') {
            throw err;
          }

          // for all other errors throw a generic error to prevent leaking info
          return ctx.notImplemented();
        }

        // 이메일이 존재하지 않거나, 비밀번호를 잘못 입력했을 경우
        if (!user) {
          strapi.eventHub.emit('admin.auth.error', {
            error: new Error(info.message),
            provider: 'local',
          });
          throw new ApplicationError(info.message);
        }

        // ---------------------- 로그인 성공 시  ----------------------

        // user : password, resetPasswordToken, registrationToken 존재
        // sanitizedUser: password, resetPasswordToken, registrationToken를 제거한 user
        const sanitizedUser = getService('user').sanitizeUser(user);
        strapi.eventHub.emit('admin.auth.success', {
          user: sanitizedUser,
          provider: 'local',
        });

        ctx.body = {
          data: {
            token: getService('token').createJwtToken(user),
            user: sanitizedUser,
          },
        } satisfies Login.Response;
      }
    )(ctx, next);
  }

  await next();
};
