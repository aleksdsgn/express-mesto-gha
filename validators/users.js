import { Joi, Segments } from 'celebrate';
import {
  celebrate,
  schemeObjectId,
  schemeURL,
} from './common.js';

// относится только к роуту /me или /id
// применяется только к тому роуту у которого есть переменная id. она его параметр
export const schemeRouteMe = Joi.alternatives().try(
  Joi.string().equal('me'),
  schemeObjectId,
).required();

// примитивные значения с обязательными полями
export const schemeAvatar = schemeURL;
export const schemeEmail = Joi.string().email().required();
const schemePassword = Joi.string().required();
// примитивные значения с без обязательных полей
const schemeName = Joi.string().min(2).max(30);
const schemeAbout = Joi.string().min(2).max(30);

// схемы которые описывают объекты
const schemeObjectRouteMe = Joi.object({
  userId: schemeRouteMe,
}).required();

// схема обновления информации о пользователе
const schemeObjectProfile = Joi.object({
  name: schemeName,
  about: schemeAbout,
}).required();

// схема обновления аватара
const schemeObjectAvatar = Joi.object({
  avatar: schemeAvatar,
}).required();

// схема авторизации
const schemeObjectAuth = Joi.object({
  email: schemeEmail,
  password: schemePassword,
}).required();

// схема для регистрации
const schemeObjectUser = schemeObjectAuth
  .concat(schemeObjectProfile)
  .concat(schemeObjectAvatar);

// сегменты из схем
const segmentBodyProfile = { [Segments.BODY]: schemeObjectProfile };
const segmentBodyAvatar = { [Segments.BODY]: schemeObjectAvatar };
const segmentBodyAuth = { [Segments.BODY]: schemeObjectAuth };
const segmentBodyUser = { [Segments.BODY]: schemeObjectUser };
const segmentParamsRouteMe = { [Segments.PARAMS]: schemeObjectRouteMe };

// мидлвары
export const celebrateBodyProfile = celebrate(segmentBodyProfile);
export const celebrateBodyAvatar = celebrate(segmentBodyAvatar);
export const celebrateBodyAuth = celebrate(segmentBodyAuth);
export const celebrateBodyUser = celebrate(segmentBodyUser);
export const celebrateParamsRouteMe = celebrate(segmentParamsRouteMe);
