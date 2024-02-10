import { Event } from '@strapi/database/dist/lifecycles';
import { errors } from '@strapi/utils';
import { validateRelationField } from '../../../../utils/validateRelationField';

const { ValidationError } = errors;

export default {
  async beforeUpdate(event: Event) {
    try {
      await validateRelationField({
        event,
        uid: 'api::comment.comment',
        requiredRelationEntityList: ['article'],
      });
    } catch (err) {
      throw new ValidationError(err.message);
    }
  },
};
