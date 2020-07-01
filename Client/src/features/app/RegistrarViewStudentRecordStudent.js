import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container, Text } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip, Descriptions } from 'antd';
import { Modal, Popconfirm, Search, Breadcrumb, AutoComplete, Input, message } from 'antd';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import bg from '../../images/BG.png';
import { getImageUrl, getPlaceholder } from '../../utils';
import AllStudentFinalGrades from './AllStudentFinalGrades';
const { Option } = AutoComplete;

function ProfileImage({ avatarURL }) {
  return <img className="card-profile-img" alt="Profile" src={avatarURL} />;
}

function Profile({ className, children, name, avatarURL = '', backgroundURL = '', bio }) {
  const classes = cn('card-profile', className);
  return (
    <Card className={classes}>
      <Card.Header backgroundURL={backgroundURL} />
      <Card.Body className="text-center">
        <ProfileImage avatarURL={avatarURL} />
        <Header.H3 className="mb-3">{name}</Header.H3>
        <p className="mb-4">{bio || children}</p>
      </Card.Body>
    </Card>
  );
}

export class RegistrarViewStudentRecordStudent extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingTable: true,
      name: '',
      email: '',
      accountID: '',
      imageUrl: '',
      data: [],
      schoolYearID: 0,
      schoolYear: '',
      page: 1,
      pageSize: 10,
      numOfPages: 1,
      quarter: '',
      finalGrade: -1,
      sectionName: '',
    };
  }

  componentDidMount() {
    axios.post('api/registrar/getsy', { schoolYearID: this.props.schoolYearID }).then(res => {
      this.setState({
        schoolYearID: res.data.schoolYearID,
        schoolYear: res.data.schoolYear,
      });
      axios.post('api/registrar/studentinfo', { studentID: this.props.id }).then(res2 => {
        axios
          .post('api/registrar/getsectionstudent', {
            studentID: this.props.id,
            schoolYearID: this.props.schoolYearID,
          })
          .then(res5 => {
            this.setState({
              email: res2.data.email,
              imageUrl: res2.data.imageUrl,
              name: res2.data.name,
              isLoading: false,
              sectionName: res5.data.sectionName,
            });
            axios
              .post('api/registrar/studentfinalrecord', {
                studentID: this.props.id,
                schoolYearID: this.props.schoolYearID,
                quarter: this.props.quarter,
              })
              .then(res3 => {
                this.setState({
                  isLoadingTable: false,
                  data: res3.data.data,
                  finalGrade: res3.data.finalGrade,
                });
              })
              .catch(err => {
                this.setState({
                  isLoadingTable: false,
                  data: [],
                  finalGrade: -1,
                });
              });
          });
      });
    });
  }

  render() {
    const DisplayData = [];
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
    return (
      <div className="app-registrar-view-student-record-student my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col sm={12} lg={4} md={8}>
              <Spin spinning={this.state.isLoading}>
                <Grid.Row>
                  <Container>
                    <Grid.Row>
                      {this.state.isLoading ? (
                        <Profile name="" avatarURL={placeholder} backgroundUrl=""></Profile>
                      ) : (
                        <Profile
                          name={this.state.name}
                          avatarURL={
                            this.state.imageUrl === 'NA'
                              ? placeholder
                              : getImageUrl(this.state.imageUrl)
                          }
                          backgroundURL={bg}
                        ></Profile>
                      )}
                    </Grid.Row>
                  </Container>
                </Grid.Row>
              </Spin>
            </Grid.Col>
            <Grid.Col sm={12} lg={8} md={8}>
              <Container>
                <Spin spinning={this.state.isLoading}>
                  <Grid.Row>
                    <Card statusColor="success">
                      <Card.Body>
                        <Grid.Row>
                          <Grid.Col sm={12} xs={12} md={8}>
                            {' '}
                            <Card.Title>Student Record of {this.state.name}</Card.Title>
                            <Card.Title>
                              <Text.Small>
                                S.Y {this.state.schoolYear} {this.props.quarter}
                              </Text.Small>
                            </Card.Title>
                          </Grid.Col>
                          <Grid.Col sm={12} xs={12} md={4}>
                            <AllStudentFinalGrades
                              text={'Grades for S.Y. ' + this.state.schoolYear}
                              schoolYear={this.state.schoolYear}
                              id={this.props.id}
                              schoolYearID={this.props.schoolYearID}
                            />
                          </Grid.Col>
                        </Grid.Row>
                        <Card.Body>
                          <Spin spinning={this.state.isLoadingTable}>
                            <Grid.Row>
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
                            <Grid.Row>
                              <span style={{ fontSize: '18px' }}>
                                Final Grade for {this.props.quarter}:{' '}
                                <b>
                                  {this.state.finalGrade == -1
                                    ? 'Not yet available'
                                    : this.state.finalGrade}
                                </b>
                              </span>
                            </Grid.Row>
                          </Spin>
                        </Card.Body>
                      </Card.Body>
                      <Card.Footer>
                        <Button.List align="right">
                          {this.props.app.auth.user.position == 2 && (
                            <Button
                              color="primary"
                              icon="file"
                              disabled={this.state.data.length == 0}
                              onClick={() =>
                                this.props.actions.generatePdfStudent(
                                  {
                                    studentID: this.props.id,
                                    schoolYearID: this.props.schoolYearID,
                                    quarter: this.props.quarter,
                                  },
                                  'Registrar',
                                )
                              }
                            >
                              Generate Report Card
                            </Button>
                          )}
                        </Button.List>
                      </Card.Footer>
                    </Card>
                  </Grid.Row>
                </Spin>
              </Container>
            </Grid.Col>
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
)(RegistrarViewStudentRecordStudent);
