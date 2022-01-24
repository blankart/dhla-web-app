import React, { Component } from 'react';

import { Error404Page } from 'tabler-react';

function StandaloneFormPage(props) {
  return (
    <div className="page">
      <div className="page-single">
        <div className="container">
          <div className="row">
            <div className="col col-login mx-auto">
              <div className="text-center mb-6"></div>
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default class Page404 extends Component {
  static propTypes = {};

  render() {
    return (
      <StandaloneFormPage>
        <Error404Page />
      </StandaloneFormPage>
    );
  }
}
