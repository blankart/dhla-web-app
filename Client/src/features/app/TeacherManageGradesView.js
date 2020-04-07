import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import NavBar from './NavBar';
import TeacherManageGrades from './TeacherManageGrades';
import { Container, Grid } from 'tabler-react';
import { Result, Button } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class TeacherManageGradesView extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      locked: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    if (!this.props.app.auth.isAuthenticated) {
      this.props.history.push('/login');
    } else {
      if (this.props.app.auth.user.position != 3) {
        this.props.history.push('/page401');
      } else {
        if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(this.props.match.params.q)) {
          this.props.history.push('/page404');
        }
      }
    }
  }

  componentWillMount() {
    axios
      .get('api/teacher/getsy')
      .then(res => {
        this.setState({ locked: false, isLoading: false });
      })
      .catch(err => {
        this.setState({ locked: true, isLoading: false });
      });
  }

  render() {
    return (
      <div className="app-teacher-manage-grades-view">
        {this.state.isLoading ? (
          ''
        ) : this.state.locked ? (
          <NavBar>
            <Container>
              <Grid.Row>
                <Grid.Col xs={12} sm={12} md={12}>
                  <Result
                    status="403"
                    title="No Active School Year"
                    subTitle="Sorry, you are not authorized to access this page now. Please contact your system administrator for details."
                    extra={
                      <Link to="/">
                        <Button type="primary">Back Home</Button>
                      </Link>
                    }
                  />
                </Grid.Col>
              </Grid.Row>
            </Container>
          </NavBar>
        ) : (
          <NavBar>
            <Container>
              <Grid.Row>
                <Grid.Col xs={12} sm={12} md={12}>
                  <TeacherManageGrades
                    subsectID={this.props.match.params.id}
                    quarter={this.props.match.params.q}
                  />
                </Grid.Col>
              </Grid.Row>
            </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(TeacherManageGradesView);
