import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Container, Grid, Card, Button, Form, Header, List } from 'tabler-react';
import AdminCreateAccount from './AdminCreateAccount';
import AdminActivateAccount from './AdminActivateAccount';
import AdminViewUpdateLog from './AdminViewUpdateLog';

export class AdminDashboard extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="app-admin-dashboard my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col xs={12} sm={12} md={5}>
              <AdminCreateAccount />
            </Grid.Col>
            <Grid.Col sm={12} md={7}>
              <AdminActivateAccount />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col sm={12} md={12}>
              <AdminViewUpdateLog />
            </Grid.Col>
            <Grid.Col sm={12} md={12}></Grid.Col>
          </Grid.Row>
        </Container>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminDashboard);
