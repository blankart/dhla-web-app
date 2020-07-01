import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import configStore from './common/configStore';
import routeConfig from './common/routeConfig';
import Root from './Root';
import setAuthToken from './common/setAuthToken';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import * as actions from './features/app/redux/actions';
import { BASE_URL } from './utils';
const store = configStore();

const MAX_REQUESTS_COUNT = 5;
const INTERVAL_MS = 50;
let PENDING_REQUESTS = 0;

axios.defaults.baseURL = BASE_URL;
// axios.defaults.baseURL = 'https://24af2174.ngrok.io';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.interceptors.request.use(function(config) {
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
        PENDING_REQUESTS++;
        clearInterval(interval);
        resolve(config);
      }
    }, INTERVAL_MS);
  });
});
/**
 * Axios Response Interceptor
 */
axios.interceptors.response.use(
  function(response) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.resolve(response);
  },
  function(error) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.reject(error);
  },
);

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(actions.setCurrentUser(decoded));
  store.dispatch(actions.getCurrentProfile());
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(actions.logoutUser());
    window.location.href = '/login';
  }
}

function renderApp(app) {
  render(<AppContainer>{app}</AppContainer>, document.getElementById('root'));
}

renderApp(<Root store={store} routeConfig={routeConfig} />);

// Hot Module Replacement API
/* istanbul ignore if  */
if (module.hot) {
  module.hot.accept('./common/routeConfig', () => {
    const nextRouteConfig = require('./common/routeConfig').default; // eslint-disable-line
    renderApp(<Root store={store} routeConfig={nextRouteConfig} />);
  });
  module.hot.accept('./Root', () => {
    const nextRoot = require('./Root').default; // eslint-disable-line
    renderApp(<Root store={store} routeConfig={routeConfig} />);
  });
}
