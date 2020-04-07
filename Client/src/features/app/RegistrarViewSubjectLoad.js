import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip } from 'antd';
import { Modal, Popconfirm, Search, Breadcrumb, AutoComplete, Input, message } from 'antd';
import RegistrarAddNewLoad from './RegistrarAddNewLoad';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import bg from '../../images/BG.png';
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

export class RegistrarViewSubjectLoad extends Component {
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
      keyword: '',
      pageSize: 10,
      numOfPages: 1,
    };
  }

  componentDidMount() {
    axios.get('api/registrar/getsy').then(res => {
      this.setState({ schoolYearID: res.data.schoolYearID, schoolYear: res.data.schoolYear });
      axios.post('api/registrar/userinfo', { accountID: this.props.id }).then(res2 => {
        this.setState({
          email: res2.data.email,
          imageUrl: res2.data.imageUrl,
          name: res2.data.name,
          isLoading: false,
        });
        axios
          .post('api/registrar/getsubjectsection', {
            page: this.state.page,
            pageSize: this.state.pageSize,
            accountID: this.props.id,
            schoolYearID: res.data.schoolYearID,
          })
          .then(res3 => {
            this.setState({
              numOfpages: res3.data.numOfPages,
              data: res3.data.subjectSectionData,
              isLoadingTable: false,
            });
          })
          .catch(err => {
            this.setState({ isLoadingTable: false, data: [] });
          });
      });
    });
  }

  paginate = page => {
    this.setState({
      page,
    });
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/getsubjectsection', {
        page,
        pageSize: this.state.pageSize,
        accountID: this.props.id,
        schoolYearID: this.state.schoolYearID,
      })
      .then(res => {
        this.setState({ isLoadingTable: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.subjectSectionData,
        });
      })
      .catch(err => {
        this.setState({ isLoadingTable: false, data: [] });
      });
  };

  deleteSubjectSection(key) {
    this.props.actions.deleteSubjectSection({ subsectID: key });
  }

  componentWillReceiveProps() {
    axios.get('api/registrar/getsy').then(res => {
      this.setState({ schoolYearID: res.data.schoolYearID, schoolYear: res.data.schoolYear });
      axios.post('api/registrar/userinfo', { accountID: this.props.id }).then(res2 => {
        this.setState({
          email: res2.data.email,
          imageUrl: res2.data.imageUrl,
          name: res2.data.name,
          isLoading: false,
        });
        axios
          .post('api/registrar/getsubjectsection', {
            page: this.state.page,
            pageSize: this.state.pageSize,
            accountID: this.props.id,
            schoolYearID: res.data.schoolYearID,
          })
          .then(res3 => {
            this.setState({
              numOfpages: res3.data.numOfPages,
              data: res3.data.subjectSectionData,
              isLoadingTable: false,
            });
          })
          .catch(err => {
            this.setState({ isLoadingTable: false, data: [] });
          });
      });
    });
  }

  render() {
    const displayGradeLevel = gradeLevel => {
      switch (gradeLevel) {
        case 'N':
          return 'Nursery';
        case 'K1':
          return 'Kinder 1';
        case 'K2':
          return 'Kinder 2';
        case 'G1':
          return 'Grade 1';
        case 'G2':
          return 'Grade 2';
        case 'G3':
          return 'Grade 3';
        case 'G4':
          return 'Grade 4';
        case 'G5':
          return 'Grade 5';
        case 'G6':
          return 'Grade 6';
        case 'G7':
          return 'Grade 7';
        case 'G8':
          return 'Grade 8';
        case 'G9':
          return 'Grade 9';
        case 'G10':
          return 'Grade 10';
        case 'G11':
          return 'Grade 11';
        case 'G12':
          return 'Grade 12';
        default:
          return '';
      }
    };
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col>{value.subjectCode}</Table.Col>
          <Table.Col>{value.subjectName}</Table.Col>
          <Table.Col>{displayGradeLevel(value.gradeLevel)}</Table.Col>
          <Table.Col>{value.sectionName}</Table.Col>
          <Table.Col>
            <Link to={`/assignsubjectload/viewload/${this.props.id}/edit/${value.key}`}>
              <Button pill size="sm" icon="edit" color="primary"></Button>
            </Link>
            <Popconfirm
              title="Do you want to remove this subject load?"
              onConfirm={() => this.deleteSubjectSection(value.key)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button pill size="sm" icon="trash" color="danger"></Button>
            </Popconfirm>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-registrar-view-subject-load my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col sm={12} lg={4}>
              {this.state.isLoading ? (
                <Spin spinning={this.state.isLoading}>
                  <Profile name="" avatarURL={placeholder} backgroundUrl=""></Profile>
                </Spin>
              ) : (
                <Profile
                  name={this.state.name}
                  avatarURL={this.state.imageUrl === 'NA' ? placeholder : this.state.imageUrl}
                  backgroundURL={bg}
                ></Profile>
              )}
            </Grid.Col>
            <Grid.Col sm={12} lg={8}>
              <Grid.Row>
                <Card>
                  <Card.Body>
                    {this.state.isLoading ? (
                      ''
                    ) : (
                      <div>
                        <Card.Title>
                          <Breadcrumb>
                            <Breadcrumb.Item>Teachers</Breadcrumb.Item>
                            <Breadcrumb.Item>Assign Subject Load</Breadcrumb.Item>
                            <Breadcrumb.Item>View Load</Breadcrumb.Item>
                            <Breadcrumb.Item>{this.state.name}</Breadcrumb.Item>
                          </Breadcrumb>
                        </Card.Title>
                        <Card.Title>
                          Subject Load of {this.state.name} S.Y. {this.state.schoolYear}
                        </Card.Title>
                      </div>
                    )}
                    <Grid.Row>
                      <Grid.Col sm={12} md={12} xs={12}>
                        <Spin spinning={this.state.isLoadingTable}>
                          <Table highlightRowOnHover={true} responsive={true}>
                            <Table.Header>
                              <Table.ColHeader>Subject Code</Table.ColHeader>
                              <Table.ColHeader>Subject Name</Table.ColHeader>
                              <Table.ColHeader>Grade Level</Table.ColHeader>
                              <Table.ColHeader>Section</Table.ColHeader>
                              <Table.ColHeader>Actions</Table.ColHeader>
                            </Table.Header>
                            <Table.Body>
                              {DisplayData.length == 0 ? (
                                <Table.Row>
                                  <Table.Col colSpan={5} alignContent="center">
                                    No entries.
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
              </Grid.Row>
              <Grid.Row>
                {this.state.isLoading ? (
                  <Spin spinning={true}>
                    <Card></Card>
                  </Spin>
                ) : (
                  <RegistrarAddNewLoad
                    schoolYearID={this.state.schoolYearID}
                    accountID={this.props.id}
                  />
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarViewSubjectLoad);
