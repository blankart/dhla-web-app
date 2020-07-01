import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Site, Form, Grid, Container, RouterContextProvider } from 'tabler-react';
import { NavLink, withRouter } from 'react-router-dom';
import DHLALogo from '../../images/logo.png';
import { Modal, message } from 'antd';
import { Spin } from 'antd';
import { Header } from 'tabler-react';
import { getImageUrl, getPlaceholder } from '../../utils';
import axios from 'axios';

const showNavBarItems = (position, props) => {
  switch (position) {
    case false:
      // Navbar items for Administrator
      return [
        {
          value: 'Dashboard',
          to: '/dashboard',
          icon: 'home',
          LinkComponent: withRouter(NavLink),
        },
      ];
    case true:
      // Navbar items for Director
      return [
        {
          value: 'Home',
          to: '/dashboard',
          icon: 'home',
          LinkComponent: withRouter(NavLink),
        },
        {
          value: 'Grades',
          icon: 'book',
          subItems: [
            {
              value: 'View Student Records',
              to: '/viewstudentrecord',
              LinkComponent: withRouter(NavLink),
            },
          ],
        },
      ];
    case 2:
      // Navbar items for Registrar
      return [
        {
          value: 'Home',
          to: '/dashboard',
          icon: 'home',
          LinkComponent: withRouter(NavLink),
        },
        {
          value: 'Sections',
          icon: 'file',
          subItems: [
            {
              value: 'Sections List',
              to: '/sectionslist',
              LinkComponent: withRouter(NavLink),
            },
            {
              value: 'Manage Students',
              to: '/managestudents',
              LinkComponent: withRouter(NavLink),
            },
          ],
        },
        {
          value: 'Teachers',
          icon: 'user',
          subItems: [
            {
              value: 'Assign Advisory Section',
              to: '/assignadvisorysection',
              LinkComponent: withRouter(NavLink),
            },
            {
              value: 'Assign Subject Load',
              to: '/assignsubjectload',
              LinkComponent: withRouter(NavLink),
            },
          ],
        },
        {
          value: 'Deliberation',
          icon: 'file',
          subItems: [
            {
              value: 'Individual Deliberation',
              to: '/individualdeliberation',
              LinkComponent: withRouter(NavLink),
            },
            {
              value: 'Group Deliberation',
              to: '/groupdeliberation',
              LinkComponent: withRouter(NavLink),
            },
          ],
        },
        {
          value: 'Grades',
          icon: 'book',
          subItems: [
            {
              value: 'View Student Records',
              to: '/viewstudentrecord',
              LinkComponent: withRouter(NavLink),
            },
          ],
        },
        {
          value: 'School Information',
          icon: 'info',
        },
      ];
    case 3:
      // Navbar items for Teacher
      let nav = [
        {
          value: 'Home',
          to: '/dashboard',
          icon: 'home',
          LinkComponent: withRouter(NavLink),
        },
        {
          value: 'Subjects',
          icon: 'file',
          subItems: [
            {
              value: 'View Subject Load',
              to: '/viewsubjectload',
              LinkComponent: withRouter(NavLink),
            },
          ],
        },
      ];
      if (props.app.auth.user.isAdviser) {
        nav.push({
          value: 'Adviser',
          icon: 'user',
          subItems: [
            {
              value: 'View Student Grades',
              to: '/viewadviseegrades',
              LinkComponent: withRouter(NavLink),
            },
          ],
        });
      }
      return nav;
    case 4:
      // Navbar items for Student
      return [
        {
          value: 'Home',
          to: '/dashboard',
          icon: 'home',
          LinkComponent: withRouter(NavLink),
        },
        {
          value: 'Grade',
          icon: 'file',
          to: '/viewstudentgrade',
          LinkComponent: withRouter(NavLink),
        },
      ];
    case 5:
      // Navbar items for Parent
      return [
        {
          value: 'Home',
          to: '/dashboard',
          icon: 'home',
          LinkComponent: withRouter(NavLink),
        },
        {
          value: 'Grade',
          icon: 'file',
          to: '/viewstudentgrade',
          LinkComponent: withRouter(NavLink),
        },
      ];
    case 6:
      // Navbar items for Cashier
      return [
        {
          value: 'Home',
          to: '/dashboard',
          icon: 'home',
          LinkComponent: withRouter(NavLink),
        },
      ];
    default:
      return [];
  }
};

export class NavBar extends Component {
  propTypes = {
    app: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      firstName: 'NA',
      lastName: 'NA',
      position: '',
      currentPassword: '',
      password: '',
      password2: '',
      errors: {},
      showChangePw: false,
      showLoading: true,
      showLoading2: false,
    };
    this.logoutClick = this.logoutClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showChangePw = this.showChangePw.bind(this);
    this.hideChangePw = this.hideChangePw.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  changePassword() {
    // this.props.actions.changePassword({
    //   currentPassword: this.state.currentPassword,
    //   password: this.state.password,
    //   password2: this.state.password2,
    // });
    this.setState({ showLoading2: true });
    axios
      .post('api/users/changepassword', {
        currentPassword: this.state.currentPassword,
        password: this.state.password,
        password2: this.state.password2,
      })
      .then(res => {
        message.success('You have successfully changed your password!');
        this.setState({
          showLoading2: false,
          showChangePw: false,
          errors: {},
        });
      })
      .catch(err => {
        this.setState({
          showLoading2: false,
          errors: err.response.data,
        });
      });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  componentWillMount() {
    if (Object.keys(this.props.app.profile).length !== 0) {
      this.setState({
        firstName: this.props.app.profile.firstName,
        lastName: this.props.app.profile.lastName,
        imageUrl: this.props.app.profile.imageUrl,
        showLoading: false,
        position: this.props.app.auth.user.position,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      firstName: nextProps.app.profile.firstName,
      lastName: nextProps.app.profile.lastName,
      imageUrl: nextProps.app.profile.imageUrl,
      showLoading: false,
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
    this.props.actions.setLoadingTrue();
    this.props.actions.logoutUser().then((window.location.href = '/login'));
  }

  render() {
    const capitalize = string => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    const { firstName, lastName, imageUrl } = this.state;
    const { position } = this.state;
    const { errors } = this.state;
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
        case 6:
          return 'Cashier';
        default:
          return '';
      }
    };
    const accountDropdownProps = {
      avatarURL: imageUrl === 'NA' ? getPlaceholder() : getImageUrl(imageUrl),
      name: firstName + ' ' + lastName,
      description: displayPosition(position),
      options: [
        {
          icon: 'user',
          value: 'Edit Profile',
          to: '/profile',
          LinkComponent: withRouter(NavLink),
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
        {this.state.showLoading ? (
          ''
        ) : (
          <div>
            <Modal
              title="Change Password"
              visible={this.state.showChangePw}
              onOk={this.changePassword}
              confirmLoading={this.state.showLoading2}
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
              navProps={{ itemsObjects: showNavBarItems(position, this.props) }}
              routerContextComponentType={withRouter(RouterContextProvider)}
              footerProps={{
                copyright: (
                  <div>
                    Copyright © 2019
                    <a href="."> Dee Hwa Liong Academy</a>. All rights reserved.
                  </div>
                ),
              }}
            >
              <Container className="fh">{this.props.children}</Container>
            </Site.Wrapper>
          </div>
        )}
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
