import { Router } from 'express';

import {
  getCards,
  createCard,
  deleteCardById,
} from '../controllers/cards.js';

export const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);
