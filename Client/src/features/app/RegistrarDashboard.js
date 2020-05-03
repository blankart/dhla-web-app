import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Container, Grid } from 'tabler-react';
import RegistrarSetSubmissionDeadline from './RegistrarSetSubmissionDeadline';
import SchoolYearInfo from './SchoolYearInfo';
import RegistrarViewUpdateLog from './RegistrarViewUpdateLog';
import { Spin } from 'antd';

export class RegistrarDashboard extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  render() {
    return (
      <div className="app-admin-profile my-3 my-md-5">
        <Spin spinning={this.props.app.showLoading}>
          <Container>
            <Grid.Row>
              <Grid.Col sm={12} xs={12} md={6} lg={6}>
                <Grid.Row>
                  <RegistrarSetSubmissionDeadline />
                </Grid.Row>
              </Grid.Col>
              <Grid.Col sm={12} xs={12} md={6} lg={6}>
                <Grid.Row>
                  <SchoolYearInfo />
                </Grid.Row>
              </Grid.Col>
            </Grid.Row>
          </Container>
        </Spin>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarDashboard);
