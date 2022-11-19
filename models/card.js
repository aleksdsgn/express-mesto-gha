import mongoose from 'mongoose';
import { linkRegex } from '../validators/common.js';

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      // проверка регуяркой
      validator: (value) => linkRegex.test(value),
      message: (props) => `${props.value} Проверьте корректность ссылки`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export const Card = mongoose.model('card', cardSchema);
