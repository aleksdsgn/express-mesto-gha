import { Joi, Segments } from 'celebrate';
import {
  celebrate,
  schemeObjectId,
  schemeURL,
} from './common.js';

export const schemeRouteId = schemeObjectId;
export const schemeName = Joi.string().min(2).max(30).required();

export const schemeObjectRouteId = Joi.object({
  cardId: schemeRouteId,
}).required();

// обязательно как сама ссылка так и сам объект со ссылкой
export const schemaObjectCard = Joi.object({
  name: schemeName,
  link: schemeURL.required(),
});

// сегменты из схем
const segmentBodyCard = { [Segments.BODY]: schemaObjectCard };
const segmentParamsRouteId = { [Segments.PARAMS]: schemeObjectRouteId };

// мидлвары
export const celebrateBodyCard = celebrate(segmentBodyCard);
export const celebrateParamsRouteId = celebrate(segmentParamsRouteId);
