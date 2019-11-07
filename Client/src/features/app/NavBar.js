import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Site, Form, Grid, Container, RouterContextProvider } from 'tabler-react';
import { NavLink, withRouter } from 'react-router-dom';
import DHLALogo from '../../images/logo.png';
import { Modal } from 'antd';
import { Spin } from 'antd';

const navBarItems = [
  {
    value: 'Dashboard',
    to: '/dashboard',
    icon: 'home',
  },
];

export class NavBar extends Component {
  propTypes = {
    app: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      position: '',
      currentPassword: '',
      password: '',
      password2: '',
      errors: {},
      showChangePw: false,
      showLoading: false,
    };
    this.logoutClick = this.logoutClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showChangePw = this.showChangePw.bind(this);
    this.hideChangePw = this.hideChangePw.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  changePassword() {
    this.props.actions.changePassword({
      currentPassword: this.state.currentPassword,
      password: this.state.password,
      password2: this.state.password2,
    });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      firstName: nextProps.app.profile.firstName,
      lastName: nextProps.app.profile.lastName,
      imageUrl: nextProps.app.profile.imageUrl,
      showLoading: nextProps.app.showLoading,
      position: nextProps.app.auth.user.position,
    });
  }

  showChangePw() {
    this.setState({
      showChangePw: true,
      currentPassword: '',
      password: '',
      password2: '',
      errors: {},
    });
    this.props.actions.getErrors({});
  }

  hideChangePw() {
    this.setState({
      showChangePw: false,
      errors: {},
    });
  }

  logoutClick() {
    this.props.actions.logoutUser().then((window.location.href = '/login'));
  }

  render() {
    const capitalize = string => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    const { firstName, lastName, imageUrl } = this.state;
    const { position } = this.state;
    const { errors } = this.props.app;
    const displayPosition = position => {
      switch (position) {
        case false:
          return 'Adminitrator';
        case true:
          return 'Director';
        case 2:
          return 'Registrar';
        case 3:
          return 'Teacher';
        case 4:
          return 'Student';
        case 5:
          return 'Guardian';
        default:
          return '';
      }
    };
    const accountDropdownProps = {
      avatarURL: imageUrl,
      name: capitalize(firstName) + ' ' + capitalize(lastName),
      description: displayPosition(position),
      options: [
        {
          icon: 'user',
          value: 'Profile',
          to: '/profile',
          LinkComponent: withRouter(NavLink),
          useExact: true,
        },
        {
          icon: 'lock',
          value: 'Change password',
          onClick: this.showChangePw,
        },
        {
          icon: 'log-out',
          value: 'Sign Out',
          onClick: this.logoutClick,
        },
      ],
    };

    return (
      <div className="app-nav-bar">
        <Modal
          title="Change Password"
          visible={this.state.showChangePw}
          onOk={this.changePassword}
          onCancel={this.hideChangePw}
          okText="Change Password"
          cancelText="Close"
        >
          <Spin spinning={this.state.showLoading}>
            <Container>
              <Grid.Row>
                <Grid.Col sm={12} md={12}>
                  <Form.Group>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Input
                      type="password"
                      name="currentPassword"
                      placeholder="Current Password"
                      value={this.state.currentPassword}
                      error={errors.currentPassword}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Grid.Col>
                <Grid.Col sm={12} md={12}>
                  <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Input
                      type="password"
                      name="password"
                      placeholder="New Password"
                      value={this.state.password}
                      error={errors.password}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Grid.Col>
                <Grid.Col sm={12} md={12}>
                  <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Input
                      type="password"
                      name="password2"
                      placeholder="Confirm Password"
                      value={this.state.password2}
                      error={errors.password2}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
            </Container>
          </Spin>
        </Modal>
        <Site.Wrapper
          headerProps={{
            href: '/',
            alt: 'DHLA Web App',
            imageURL: DHLALogo,
            accountDropdown: accountDropdownProps,
          }}
          navProps={{ itemsObjects: navBarItems }}
          routerContextComponentType={withRouter(RouterContextProvider)}
          footerProps={{
            links: [
              <a href="#">First Link</a>,
              <a href="#">Second Link</a>,
              <a href="#">Third Link</a>,
              <a href="#">Fourth Link</a>,
              <a href="#">Fifth Link</a>,
              <a href="#">Sixth Link</a>,
              <a href="#">Seventh Link</a>,
              <a href="#">Eighth Link</a>,
              <a href="#">Ninth Link</a>,
              <a href="#">Tenth Link</a>,
            ],
            note: 'Input some notes here.',
            copyright: (
              <div>
                Copyright © 2019
                <a href="."> Dee Hwa Liong Academy</a>. All rights reserved.
              </div>
            ),
          }}
        >
          {this.props.children}
        </Site.Wrapper>
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
)(NavBar);
