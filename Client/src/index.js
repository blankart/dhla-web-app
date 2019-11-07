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

const store = configStore();

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
