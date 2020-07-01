import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import NavBar from './NavBar';
import axios from 'axios';
import { Pagination, Spin, Tooltip } from 'antd';
import {
  Modal,
  Popconfirm,
  Search,
  Breadcrumb,
  AutoComplete,
  Input,
  message,
  Descriptions,
  Popover,
} from 'antd';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import {
  Card,
  Button,
  Grid,
  Avatar,
  Table,
  Form,
  Header,
  Container,
  Text,
  Alert,
} from 'tabler-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getImageUrl, getPlaceholder } from '../../utils';
import AllStudentFinalGrades from './AllStudentFinalGrades';
import { Result } from 'antd';
const { Option } = AutoComplete;

export class TeacherAdviseeGrade extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      locked: false,
      isLoading: true,
      selectedQuarter: 'Q1',
      isLoading2: true,
      data: [],
      columns: [],
      studentIDs: [],
    };
  }

  componentDidMount() {
    this.props.actions.setLoadingTrue();
    if (!this.props.app.auth.isAuthenticated) {
      this.props.history.push('/login');
    } else {
      if (this.props.app.auth.user.position != 3) {
        this.props.history.push('/page401');
      } else {
        axios
          .get('api/teacher/getsy')
          .then(res => {
            this.props.actions.setLoadingFalse();
            this.setState({ locked: false, isLoading: false });
            axios
              .post('api/teacher/condensedfinalgrade', {
                sectionID: this.props.app.auth.user.sectionID,
                quarter: this.state.selectedQuarter,
                schoolYearID: this.props.app.auth.user.schoolYearID,
              })
              .then(res3 => {
                this.setState({
                  columns: res3.data.columns,
                  data: res3.data.data,
                  isLoading2: false,
                  studentIDs: res3.data.data.map(a => a.studentID),
                });
              })
              .catch(err => {
                this.setState({
                  columns: [],
                  data: [],
                  isLoading2: false,
                  studentIDs: [],
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

  refetch = () => {
    this.setState({ isLoading2: true });
    axios
      .post('api/teacher/condensedfinalgrade', {
        sectionID: this.props.app.auth.user.sectionID,
        quarter: this.state.selectedQuarter,
        schoolYearID: this.props.app.auth.user.schoolYearID,
      })
      .then(res3 => {
        this.setState({
          columns: res3.data.columns,
          data: res3.data.data,
          isLoading2: false,
          studentIDs: res3.data.data.map(a => a.studentID),
        });
      })
      .catch(err => {
        this.setState({
          columns: [],
          data: [],
          isLoading2: false,
          studentIDs: [],
        });
      });
  };

  render() {
    return (
      <div className="app-teacher-advisee-grade">
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
                  <Card className=" my-3 my-md-5">
                    <Card.Body>
                      <Card.Title>
                        Condensed Grades of {this.props.app.auth.user.sectionName} S.Y.{' '}
                        {this.props.app.auth.user.schoolYear}
                      </Card.Title>
                      <Card.Title>
                        <Breadcrumb>
                          <Breadcrumb.Item>Adviser</Breadcrumb.Item>
                          <Breadcrumb.Item>View Student Grades</Breadcrumb.Item>
                        </Breadcrumb>
                      </Card.Title>
                      <Card.Title>
                        <Grid.Col sm={12} xs={12} md={12}>
                          <Button.List align="right">
                            <Button
                              disabled={this.state.data.length == 0 || this.state.isLoading2}
                              icon="file"
                              color="primary"
                              onClick={() =>
                                this.props.actions.generatePdfSection(
                                  {
                                    studentIDs: this.state.studentIDs,
                                    quarter: this.state.selectedQuarter,
                                    schoolYearID: this.props.app.auth.user.schoolYearID,
                                  },
                                  'Registrar',
                                )
                              }
                            >
                              Generate Report Card
                            </Button>
                          </Button.List>
                        </Grid.Col>
                      </Card.Title>
                      <Card.Body>
                        <Grid.Row>
                          <Grid.Col sm={12} xs={12} md={4}>
                            <Form.Group>
                              <Form.Label>Select Quarter</Form.Label>
                              <Form.Select
                                disabled={this.state.isLoading2}
                                onChange={e =>
                                  this.setState({ selectedQuarter: e.target.value }, () =>
                                    this.refetch(),
                                  )
                                }
                                value={this.state.selectedQuarter}
                              >
                                <option value="Q1">Quarter 1</option>
                                <option value="Q2">Quarter 2</option>
                                <option value="Q3">Quarter 3</option>
                                <option value="Q4">Quarter 4</option>
                              </Form.Select>
                            </Form.Group>
                          </Grid.Col>
                        </Grid.Row>
                        <Spin spinning={this.state.isLoading2}>
                          <Grid.Row>
                            <Grid.Col sm={12} xs={12} md={12}>
                              <Alert type="info" icon="info">
                                Note: Column names with status color{' '}
                                <span className="status-icon bg-yellow" />
                                <b>
                                  <i>yellow</i>
                                </b>{' '}
                                are subjects which are still under deliberation process.{' '}
                                <b>
                                  <i>'View Condensed Grade'</i>
                                </b>{' '}
                                button shows the final grade (grades under deliberation process{' '}
                                <b>
                                  <i>not included.</i>
                                </b>
                                ) of the student per quarter.
                              </Alert>
                            </Grid.Col>
                            <Grid.Col sm={12} xs={12} md={12}>
                              <Table highlightRowOnHover={true} responsive={true}>
                                <Table.Header>
                                  {[
                                    ...[
                                      <Table.ColHeader></Table.ColHeader>,
                                      <Table.ColHeader>Name</Table.ColHeader>,
                                    ],
                                    ...this.state.columns.map(a => (
                                      <Table.ColHeader>
                                        {a.status == 'D' && (
                                          <span className={`status-icon bg-yellow`} />
                                        )}
                                        {a.subjectName}
                                      </Table.ColHeader>
                                    )),
                                  ]}
                                </Table.Header>
                                <Table.Body>
                                  {this.state.data.length == 0 ? (
                                    <Table.Row>
                                      <Table.Col colSpan={10} alignContent="center">
                                        No data available.
                                      </Table.Col>
                                    </Table.Row>
                                  ) : (
                                    this.state.data.map(value => {
                                      let tempCol = [];
                                      for (const [index2, value2] of value.grades.entries()) {
                                        tempCol.push(
                                          <Table.Col>
                                            {(value2.grade != -1 || value2.grade != 'N/A') && (
                                              <span
                                                className={`status-icon bg-${
                                                  parseFloat(value2.grade) >= 75 ? 'green' : 'red'
                                                }`}
                                              />
                                            )}
                                            {value2.grade == -1
                                              ? 'N/A'
                                              : value2.grade == 'N/A'
                                              ? 'Not enrolled'
                                              : value2.grade}
                                          </Table.Col>,
                                        );
                                      }
                                      return (
                                        <Table.Row>
                                          <Table.Col className="w-1">
                                            <Avatar
                                              imageURL={
                                                value.imageUrl == 'NA'
                                                  ? placeholder
                                                  : getImageUrl(value.imageUrl)
                                              }
                                            />
                                          </Table.Col>
                                          <Table.Col>{value.name}</Table.Col>
                                          {tempCol}
                                          <Table.Col>
                                            <Tooltip placement="top" title="View all grades">
                                              <AllStudentFinalGrades
                                                text="View Condensed Grade"
                                                schoolYear={this.props.app.auth.user.schoolYear}
                                                id={value.studentID}
                                                schoolYearID={this.props.app.auth.user.schoolYearID}
                                              />
                                            </Tooltip>
                                          </Table.Col>
                                        </Table.Row>
                                      );
                                    })
                                  )}
                                </Table.Body>
                              </Table>
                            </Grid.Col>
                          </Grid.Row>
                        </Spin>
                      </Card.Body>
                    </Card.Body>
                  </Card>
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
)(TeacherAdviseeGrade);
