import { Event } from '@strapi/database/dist/lifecycles';
import { errors } from '@strapi/utils';
import { validateRelationField } from '../../../../utils/validateRelationField';

const { ValidationError } = errors;

export default {
  async beforeUpdate(event: Event) {
    try {
      await validateRelationField({
        event,
        uid: 'api::article.article',
        requiredRelationEntityList: ['categories', 'hashtags'],
      });
    } catch (err) {
      throw new ValidationError(err.message);
    }
  },
};
