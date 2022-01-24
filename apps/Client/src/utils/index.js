import axios from 'axios';

export const BASE_URL = 'https://api-deehwaliongdev.herokuapp.com';
export const WEB_BASE_URL = 'https://dhla-web-app.vercel.app';
export const getImageUrl = imageUrl => {
  return `${BASE_URL}/${imageUrl}`;
};

export const getLocalUrl = Url => `${WEB_BASE_URL}${Url}`;

export const getPlaceholder = () => `${BASE_URL}/images/placeholder.jpg`;

export default {
  getPlaceholder,
  getLocalUrl,
  BASE_URL,
  getImageUrl,
};
