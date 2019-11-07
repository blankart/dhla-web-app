import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import NavBar from './NavBar';
import AdminProfile from './AdminProfile';
import DirectorProfile from './DirectorProfile';
import RegistrarProfile from './RegistrarProfile';
import TeacherProfile from './TeacherProfile';
import StudentProfile from './StudentProfile';
import ParentProfile from './ParentProfile';

function ProfileComponent(props) {
  const { position } = props;
  switch (position) {
    case false:
      return <AdminProfile />;
    case true:
      return <DirectorProfile />;
    case 2:
      return <RegistrarProfile />;
    case 3:
      return <TeacherProfile />;
    case 4:
      return <StudentProfile />;
    case 5:
      return <ParentProfile />;
    default:
      return <div></div>;
  }
}
export class ProfileView extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (!this.props.app.auth.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.app.auth.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      <div className="app-profile-view">
        <NavBar>
          <ProfileComponent position={this.props.app.auth.user.position} />
        </NavBar>
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
)(ProfileView);
