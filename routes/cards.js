import { Router } from 'express';

import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards.js';

export const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
