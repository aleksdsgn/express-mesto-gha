import { Router } from 'express';
import {
  celebrateBodyCard,
  celebrateParamsRouteId,
} from '../validators/cards.js';

import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards.js';

export const router = Router();

// получить все карточки
router.get('/', getCards);

// добавить новую карточку
router.post('/', celebrateBodyCard, createCard);

// удалить карточку
router.delete('/:cardId', celebrateParamsRouteId, deleteCardById);

// поставить лайк карточке
router.put('/:cardId/likes', celebrateParamsRouteId, likeCard);

// удалить лайк карточке
router.delete('/:cardId/likes', celebrateParamsRouteId, dislikeCard);
