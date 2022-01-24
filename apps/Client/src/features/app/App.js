import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from './redux/actions';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { connect } from 'react-redux';

/*
  This is the root component of your app. Here you define the overall layout
  and the container of the react router.
  You should adjust it according to the requirement of your app.
*/
export class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: '',
  };

  render() {
    const { showLoading } = this.props;
    return (
      <div className="app-app">
        <div className="page-container">
          <Spin spinning={showLoading} size="large">
            {this.props.children}
          </Spin>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    showLoading: state.app.showLoading,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
