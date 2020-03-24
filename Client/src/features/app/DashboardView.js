import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import NavBar from './NavBar';
import AdminDashboard from './AdminDashboard';
import DirectorDashboard from './DirectorDashboard';
import RegistrarDashboard from './RegistrarDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import ParentDashboard from './ParentDashboard';
import { withRouter } from 'react-router-dom';

function DashboardComponent(props) {
  const { position } = props;
  switch (position) {
    case false:
      return <AdminDashboard />;
    case true:
      return <DirectorDashboard />;
    case 2:
      return <RegistrarDashboard />;
    case 3:
      return <TeacherDashboard />;
    case 4:
      return <StudentDashboard />;
    case 5:
      return <ParentDashboard />;
    default:
      return <div></div>;
  }
}

export class DashboardView extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (!this.props.app.auth.isAuthenticated) {
      this.props.history.push('/login');
    } else {
      this.props.actions.getCurrentProfile();
    }
  }

  render() {
    return (
      <div className="app-dashboard-view fh">
        {this.props.app.showLoading ? (
          ''
        ) : (
          <NavBar>
            <DashboardComponent position={this.props.app.auth.user.position} />
          </NavBar>
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
