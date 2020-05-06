import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip, Descriptions } from 'antd';
import { Modal, Popconfirm, Search, Breadcrumb, AutoComplete, Input, message } from 'antd';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import bg from '../../images/BG.png';
import { getImageUrl } from '../../utils';
import ClassRecordInformation from './ClassRecordInformation';
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

export class RegistrarViewStudentRecordTeacher extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingTable: true,
      isLoadingTable2: true,
      name: '',
      email: '',
      accountID: '',
      imageUrl: '',
      data: [],
      data2: [],
      schoolYearID: 0,
      schoolYear: '',
      page: 1,
      page2: 1,
      keyword: '',
      pageSize: 10,
      pageSize2: 10,
      numOfPages: 1,
      numOfPages2: 1,
      deadline: '',
      selectedClassRecordID: -1,
      selectedSubjectCode: '',
      selectedSubjectName: '',
      selectedSection: '',
      selectedDeadline: '',
      quarter: '',
    };
  }

  resetClassRecordInfo = () => {
    this.setState({
      selectedClassRecordID: -1,
      selectedSubjectCode: '',
      selectedSubjectName: '',
      selectedSection: '',
      selectedDeadline: '',
    });
  };

  componentDidMount() {
    axios.get('api/registrar/getsy').then(res => {
      this.setState({
        schoolYearID: res.data.schoolYearID,
        schoolYear: res.data.schoolYear,
        quarter: res.data.quarter,
      });
      axios.post('api/registrar/teacherinfo', { teacherID: this.props.id }).then(res2 => {
        this.setState({
          email: res2.data.email,
          imageUrl: res2.data.imageUrl,
          name: res2.data.name,
          isLoading: false,
        });
        axios
          .post('api/registrar/getfinalsubsect', {
            teacherID: this.props.id,
            page: this.state.page,
            pageSize: this.state.pageSize,
            quarter: this.props.quarter,
          })
          .then(res3 => {
            this.setState({
              data: res3.data.classRecordList,
              numOfPages: res3.data.numOfPages,
              deadline: res3.data.deadline,
              isLoadingTable: false,
            });
          })
          .catch(err => {
            this.setState({ data: [], numOfPages: 1, isLoadingTable: false });
          });
      });
    });
  }

  componentWillReceiveProps() {
    axios.get('api/registrar/getsy').then(res => {
      this.setState({
        schoolYearID: res.data.schoolYearID,
        schoolYear: res.data.schoolYear,
        quarter: res.data.quarter,
      });
      axios.post('api/registrar/teacherinfo', { teacherID: this.props.id }).then(res2 => {
        this.setState({
          email: res2.data.email,
          imageUrl: res2.data.imageUrl,
          name: res2.data.name,
          isLoading: false,
        });
        axios
          .post('api/registrar/getfinalsubsect', {
            teacherID: this.props.id,
            page: this.state.page,
            pageSize: this.state.pageSize,
            quarter: this.props.quarter,
          })
          .then(res3 => {
            this.setState({
              data: res3.data.classRecordList,
              numOfPages: res3.data.numOfPages,
              deadline: res3.data.deadline,
              isLoadingTable: false,
            });
          })
          .catch(err => {
            this.setState({ data: [], numOfPages: 1, isLoadingTable: false });
          });
      });
    });
  }

  paginate = page => {
    this.setState({ page, isLoadingTable: true }, async () => {
      axios
        .post('api/registrar/getsubmittedsubsect', {
          teacherID: this.props.id,
          page: page,
          pageSize: this.state.pageSize,
          quarter: this.state.quarter,
        })
        .then(res3 => {
          this.setState({
            data: res3.data.classRecordList,
            numOfPages: res3.data.numOfPages,
            deadline: res3.data.deadline,
            isLoadingTable: false,
          });
        });
    });
  };

  render() {
    const DisplayData = [];
    const DisplayData2 = [];
    for (const [index, value] of this.state.data.entries()) {
      const dateSubmitted = new Date(value.dateSubmitted);
      let status = '';
      if (this.state.deadline == 'NOT SET') {
        status = 'NOT SET';
      } else {
        let deadline = new Date(this.state.deadline);
        let relativeTime = new Date(Math.abs(deadline.getTime() - dateSubmitted.getTime()));
        let s = relativeTime / 1000;
        let m = s / 60;
        let h = m / 60;
        let d = h / 24;
        let overDueText = Math.floor(d) == 0 ? '' : Math.floor(d) + ' day/s ';
        overDueText =
          overDueText +
          Math.floor(h % 24) +
          ' hr ' +
          Math.floor(m % 60) +
          ' min ' +
          Math.floor(s % 60) +
          ' secs';

        status = deadline.getTime() < dateSubmitted.getTime() ? `${overDueText} late` : 'On Time';
      }
      DisplayData.push(
        <Table.Row>
          <Table.Col>{value.subjectCode}</Table.Col>
          <Table.Col>{value.subjectName}</Table.Col>
          <Table.Col>{value.section}</Table.Col>
          <Table.Col>
            <Button
              icon="eye"
              size="sm"
              outline
              pill
              color="primary"
              onClick={() =>
                this.setState({
                  selectedClassRecordID: value.classRecordID,
                  selectedSubjectCode: value.subjectCode,
                  selectedSubjectName: value.subjectName,
                  selectedSection: value.section,
                  selectedDeadline: status,
                })
              }
            >
              View
            </Button>
          </Table.Col>
        </Table.Row>,
      );
    }

    for (const [index, value] of this.state.data2.entries()) {
      let displayDate = 'NOT SET';
      if (this.state.deadline != 'NOT SET') {
        displayDate = new Date(this.state.deadline);
        displayDate = displayDate.toDateString();
      }
      DisplayData2.push(
        <Table.Row>
          <Table.Col>{value.subjectCode}</Table.Col>
          <Table.Col>{value.subjectName}</Table.Col>
          <Table.Col>{value.section}</Table.Col>
          <Table.Col>{displayDate}</Table.Col>
        </Table.Row>,
      );
    }

    return (
      <div className="app-registrar-individual-deliberation-info my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col sm={12} lg={6}>
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
              <Grid.Row>
                <Container>
                  {this.state.isLoading ? (
                    ''
                  ) : (
                    <Card statusColor="warning">
                      <Card.Body>
                        <Card.Title>
                          Class Record of {this.state.name} S.Y. {this.state.schoolYear}
                        </Card.Title>
                        <Grid.Row>
                          <Grid.Col sm={12} md={12} xs={12}>
                            <Spin spinning={this.state.isLoadingTable}>
                              <Table highlightRowOnHover={true} responsive={true}>
                                <Table.Header>
                                  <Table.ColHeader>Code</Table.ColHeader>
                                  <Table.ColHeader>Subject</Table.ColHeader>
                                  <Table.ColHeader>Section</Table.ColHeader>
                                  <Table.ColHeader>Actions</Table.ColHeader>
                                </Table.Header>
                                <Table.Body>
                                  {DisplayData.length == 0 ? (
                                    <Table.Row>
                                      <Table.Col colSpan={5} alignContent="center">
                                        No submitted class record.
                                      </Table.Col>
                                    </Table.Row>
                                  ) : (
                                    DisplayData
                                  )}
                                </Table.Body>
                              </Table>
                              <Pagination
                                size="large"
                                current={this.state.page}
                                pageSize={this.state.pageSize}
                                total={this.state.pageSize * this.state.numOfPages}
                                onChange={this.paginate}
                              />
                            </Spin>
                          </Grid.Col>
                        </Grid.Row>
                      </Card.Body>
                    </Card>
                  )}
                </Container>
              </Grid.Row>
            </Grid.Col>
            <Grid.Col sm={12} sm={6}>
              <Grid.Row>
                <Container>
                  <ClassRecordInformation
                    classRecordID={this.state.selectedClassRecordID}
                    quarter={this.props.quarter}
                    subjectCode={this.state.selectedSubjectCode}
                    subjectName={this.state.selectedSubjectName}
                    section={this.state.selectedSection}
                    deadline={this.state.selectedDeadline}
                    resetClassRecordInfo={this.resetClassRecordInfo}
                    id={this.props.id}
                    status="final"
                  />
                </Container>
              </Grid.Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarViewStudentRecordTeacher);
