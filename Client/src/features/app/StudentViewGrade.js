import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import NavBar from './NavBar';
import { Result, Descriptions } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Spin, Breadcrumb, Pagination } from 'antd';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import placeholder from '../../images/placeholder.jpg';
import { getImageUrl, getPlaceholder } from '../../utils';

export class StudentViewGrade extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      locked: false,
      isLoading: true,
      isLoading2: true,
      isLoadingTable: true,
      selectedSchoolYearID: -1,
      selectedQuarter: 'Q1',
      schoolYearOptions: [],
      data: [],
      finalGrade: -1,
      section: '',
      teacher: '',
    };
  }

  handleChange = () => {
    this.setState({ isLoadingTable: true });
    axios
      .post('api/student/studentfinalrecord', {
        schoolYearID: this.state.selectedSchoolYearID,
        quarter: this.state.selectedQuarter,
        parent: this.props.app.auth.user.position == 5,
      })
      .then(res3 => {
        this.setState({
          isLoadingTable: false,
          data: res3.data.data,
          finalGrade: res3.data.finalGrade,
          section: res3.data.section,
          teacher: res3.data.teacher,
        });
      })
      .catch(err => {
        this.setState({
          isLoadingTable: false,
          data: [],
          finalGrade: 'Student not enrolled this school year.',
          section: '',
          teacher: '',
        });
      });
  };

  componentDidMount() {
    this.props.actions.setLoadingTrue();
    if (!this.props.app.auth.isAuthenticated) {
      this.props.history.push('/login');
    } else {
      if (this.props.app.auth.user.position != 4 && this.props.app.auth.user.position != 5) {
        this.props.history.push('/page401');
      } else {
        axios
          .get('api/student/getsy')
          .then(res => {
            this.props.actions.setLoadingFalse();
            this.setState({
              locked: false,
              isLoading: false,
            });
            axios.get('api/student/getallsy').then(res2 => {
              this.setState({
                isLoading2: false,
                schoolYearOptions: res2.data.schoolYearList,
                selectedSchoolYearID: res2.data.schoolYearList[0].schoolYearID,
              });
              axios
                .post('api/student/studentfinalrecord', {
                  schoolYearID: res2.data.schoolYearList[0].schoolYearID,
                  quarter: res.data.quarter,
                  parent: this.props.app.auth.user.position == 5,
                })
                .then(res3 => {
                  this.setState({
                    isLoadingTable: false,
                    data: res3.data.data,
                    finalGrade: res3.data.finalGrade,
                    section: res3.data.section,
                    teacher: res3.data.teacher,
                  });
                })
                .catch(err => {
                  this.setState({
                    isLoadingTable: false,
                    data: [],
                    finalGrade: 'Student not enrolled this school year.',
                    section: '',
                    teacher: '',
                  });
                });
            });
          })
          .catch(err => {
            this.props.actions.setLoadingFalse();
            this.setState({ locked: true, isLoading: false });
          });
      }
    }
  }

  render() {
    const DisplayData = [];
    if (this.props.app.auth.user.position == 4) {
      for (const [index, value] of this.state.data.entries()) {
        DisplayData.push(
          <Table.Row>
            <Table.Col>{value.subjectName}</Table.Col>
            <Table.Col>
              {(value.score != -1 || value.score != 'N/A') && (
                <span
                  className={`status-icon bg-${parseFloat(value.score) >= 75 ? 'green' : 'red'}`}
                />
              )}
              {value.score == -1 ? 'Not yet available' : value.score}
            </Table.Col>
          </Table.Row>,
        );
      }
    }
    return (
      <div className="app-student-view-grade">
        {' '}
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
                        <Button color="primary">Back Home</Button>
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
                  <Card statusColor="success" className="my-3 my-md-5 card">
                    <Spin spinning={this.state.isLoading2}>
                      {' '}
                      <Card.Body>
                        <Card.Title>Student Grades List</Card.Title>
                        <Grid.Row>
                          <Grid.Col sm={12} xs={12} md={6}>
                            <Form.Group>
                              <Form.Label>Select School Year</Form.Label>
                              <Form.Select
                                onChange={e =>
                                  this.setState({ selectedSchoolYearID: e.target.value }, () =>
                                    this.handleChange(),
                                  )
                                }
                              >
                                {this.state.schoolYearOptions.map(a => (
                                  <option value={a.schoolYearID}>{a.schoolYear}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Grid.Col>
                          <Grid.Col sm={12} xs={12} md={6}>
                            <Form.Group>
                              <Form.Label>Select Quarter</Form.Label>
                              <Form.Select
                                onChange={e =>
                                  this.setState({ selectedQuarter: e.target.value }, () =>
                                    this.handleChange(),
                                  )
                                }
                              >
                                <option value="Q1">Quarter 1</option>
                                <option value="Q2">Quarter 2</option>
                                <option value="Q3">Quarter 3</option>
                                <option value="Q4">Quarter 4</option>
                              </Form.Select>
                            </Form.Group>
                          </Grid.Col>
                          <Grid.Col sm={12} xs={12} md={12}>
                            {this.props.app.auth.user.position == 4 && (
                              <Spin spinning={this.state.isLoadingTable}>
                                <Grid.Row>
                                  <Grid.Col xs={12} md={12} sm={12}>
                                    <Descriptions
                                      style={{ marginBottom: '15px', marginTop: '15px' }}
                                      bordered
                                      title="Student Information"
                                    >
                                      <Descriptions.Item label="Student Name" span={3}>
                                        {this.props.app.profile.firstName}{' '}
                                        {this.props.app.profile.middleName}{' '}
                                        {this.props.app.profile.lastName}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Section Name" span={3}>
                                        {this.state.section}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Adviser" span={3}>
                                        {this.state.teacher}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Quarter Final Grade" span={3}>
                                        {this.state.finalGrade}
                                      </Descriptions.Item>
                                    </Descriptions>
                                  </Grid.Col>
                                  <Table highlightRowOnHover={true} responsive={true}>
                                    <Table.Header>
                                      <Table.ColHeader>Subject Name</Table.ColHeader>
                                      <Table.ColHeader>Grade</Table.ColHeader>
                                    </Table.Header>
                                    <Table.Body>
                                      {DisplayData.length == 0 ? (
                                        <Table.Row>
                                          <Table.Col colSpan={2} alignContent="center">
                                            No entries.
                                          </Table.Col>
                                        </Table.Row>
                                      ) : (
                                        DisplayData
                                      )}
                                    </Table.Body>
                                  </Table>
                                </Grid.Row>
                              </Spin>
                            )}
                          </Grid.Col>
                        </Grid.Row>
                      </Card.Body>
                    </Spin>
                  </Card>
                  {this.props.app.auth.user.position == 5 && (
                    <Spin spinning={this.state.isLoadingTable}>
                      {this.state.data.map(value => (
                        <Card statusColor="success">
                          <Card.Body>
                            <Grid.Row>
                              <Grid.Col xs={12} md={12} sm={12}>
                                <Descriptions
                                  style={{ marginBottom: '15px', marginTop: '15px' }}
                                  bordered
                                  title="Student Information"
                                >
                                  <Descriptions.Item label="Student Name" span={3}>
                                    {value.name}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Section Name" span={3}>
                                    {value.section}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Adviser" span={3}>
                                    {value.teacher}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Quarter Final Grade" span={3}>
                                    {value.finalGrade}
                                  </Descriptions.Item>
                                </Descriptions>
                              </Grid.Col>
                              <Table highlightRowOnHover={true} responsive={true}>
                                <Table.Header>
                                  <Table.ColHeader>Subject Name</Table.ColHeader>
                                  <Table.ColHeader>Grade</Table.ColHeader>
                                </Table.Header>
                                <Table.Body>
                                  {value.data.length == 0 ? (
                                    <Table.Row>
                                      <Table.Col colSpan={2} alignContent="center">
                                        No entries.
                                      </Table.Col>
                                    </Table.Row>
                                  ) : (
                                    value.data.map(v => (
                                      <Table.Row>
                                        <Table.Col>{v.subjectName}</Table.Col>
                                        <Table.Col>
                                          {(v.score != -1 || v.score != 'N/A') && (
                                            <span
                                              className={`status-icon bg-${
                                                parseFloat(v.score) >= 75 ? 'green' : 'red'
                                              }`}
                                            />
                                          )}
                                          {v.score == -1 ? 'Not yet available' : v.score}
                                        </Table.Col>
                                      </Table.Row>
                                    ))
                                  )}
                                </Table.Body>
                              </Table>
                            </Grid.Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </Spin>
                  )}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StudentViewGrade);
