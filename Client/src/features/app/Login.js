import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import DHLALogo from '../../images/logo.png';
import { FormCard, FormTextInput, Site } from 'tabler-react';
import { withRouter } from 'react-router-dom';

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

export class Login extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', errors: {} };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.actions.loginUser(userData);
  }

  componentDidMount() {
    if (this.props.app.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.app.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    if (nextProps.app.errors) {
      this.setState({ errors: nextProps.app.errors });
    }
  }

  render() {
    const { errors } = this.props.app;
    return (
      <div className="app-login">
        <Site>
          <StandaloneFormPage>
            <img src={DHLALogo} style={{ marginBottom: '60px' }} alt="logo" />
            <FormCard buttonText="Login" title="Login to your account" onSubmit={this.onSubmit}>
              <FormTextInput
                name="email"
                label="Email Address"
                placeholder="Enter your email address"
                onChange={this.onChange}
                value={this.state.email}
                error={errors.email}
              />
              <FormTextInput
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                onChange={this.onChange}
                value={this.state.password}
                error={errors.password}
              />
            </FormCard>
          </StandaloneFormPage>
        </Site>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
