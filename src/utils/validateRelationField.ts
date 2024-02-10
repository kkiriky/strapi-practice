import { Event } from '@strapi/database/dist/lifecycles';
import { Shared } from '@strapi/strapi';
import { Populate } from '@strapi/types/dist/modules/entity-service/params';

interface ValidateRelationFieldParams<
  TSchemaUID extends keyof Shared.ContentTypes,
> {
  event: Event;
  uid: TSchemaUID;
  requiredRelationEntityList: Populate.Any<TSchemaUID>;
}

export async function validateRelationField<
  T extends keyof Shared.ContentTypes,
>({ event, uid, requiredRelationEntityList }: ValidateRelationFieldParams<T>) {
  // 업데이트할 데이터
  const updateData = event.params.data;

  // 현재 데이터
  const currentData = await strapi.entityService.findOne(
    uid,
    event.params.where.id,
    {
      populate: requiredRelationEntityList,
    }
  );

  // 현재 상태가 draft 상태일 경우
  if (currentData['publishedAt'] === null) {
    // publish상태로 변경하는 경우가 아니라면 필수값을 입력하지 않았더라도 수정 가능
    if (!updateData.publishedAt) return;

    // publish상태로 변경하는 경우 필수 relation이 입력되었는지 확인
    for (const relationEntity of requiredRelationEntityList as string[]) {
      // 1:N 관계에서 N인 케이스
      if (!currentData[relationEntity]) {
        throw new Error('필수 항목을 모두 입력해주세요.');
      } else if (currentData[relationEntity]?.length === 0) {
        throw new Error('필수 항목을 모두 입력해주세요.');
      }
    }
  } else {
    // 현재 상태가 publish 상태일 경우
    // draft 상태로 변경(Unpublish)하는 경우에는 체크 X
    if (updateData.publishedAt === null) return;

    for (const relationEntity of requiredRelationEntityList as string[]) {
      if (
        updateData[relationEntity].disconnect.length > 0 &&
        updateData[relationEntity].connect.length === 0
      ) {
        throw new Error('필수 항목을 모두 입력해주세요.');
      }
    }
  }
}
