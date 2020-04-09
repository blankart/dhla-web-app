import axios from 'axios';

export const BASE_URL = 'http://localhost:5000';
export const getImageUrl = imageUrl => {
  return `${BASE_URL}/${imageUrl}`;
};

export default {
  BASE_URL,
  getImageUrl,
};
