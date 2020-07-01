import axios from 'axios';

export const BASE_URL = 'http://192.168.254.178:5000';
export const WEB_BASE_URL = 'http://192.168.254.178';
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
