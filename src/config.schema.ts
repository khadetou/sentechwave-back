import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().valid('dev', 'prod').required(),
  MONGO_URI: Joi.string().required(),
});
