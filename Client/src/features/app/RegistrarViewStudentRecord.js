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
import { getImageUrl, getPlaceholder } from '../../utils';
import ClassRecordInformation from './ClassRecordInformation';
import ViewHonorStudents from './ViewHonorStudents';
import ViewFailedStudents from './ViewFailedStudents';
const { Option } = AutoComplete;

export class RegistrarViewStudentRecord extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingTable: true,
      selectedSearchBy: 'Teacher',
      selectedQuarter: 'Q1',
      selectedSchoolYear: '',
      schoolYears: [],
      data: [],
      keyword: '',
      page: 1,
      pageSize: 10,
      numOfPages: 1,
    };

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      axios.get('api/registrar/getallsy').then(res => {
        this.setState(
          {
            schoolYears: res.data.schoolYearList,
            isLoading: false,
            selectedSchoolYear: res.data.schoolYearList[0].schoolYearID,
          },
          () => {
            axios
              .post('api/registrar/getallteachers', {
                keyword: this.state.keyword,
                page: this.state.page,
                pageSize: this.state.pageSize,
              })
              .then(res2 => {
                this.setState({
                  isLoadingTable: false,
                  numOfPages: res2.data.numOfPages,
                  data: res2.data.accountList,
                });
              })
              .catch(err => {
                this.setState({ isLoadingTable: false, data: [], numOfPages: 1 });
              });
          },
        );
      });
    });
  }

  handleDropdownChange = () => {
    this.setState({ isLoadingTable: true });
    const { selectedSearchBy } = this.state;
    if (selectedSearchBy == 'Teacher' || selectedSearchBy == 'Student') {
      axios
        .post(`api/registrar/getall${selectedSearchBy.toLowerCase()}s`, {
          keyword: '',
          page: 1,
          pageSize: this.state.pageSize,
        })
        .then(res => {
          this.setState({
            isLoadingTable: false,
            numOfPages: res.data.numOfPages,
            data: res.data.accountList,
          });
        })
        .catch(err => {
          this.setState({ isLoadingTable: false, data: [], numOfPages: 1 });
        });
    } else {
      axios
        .post('api/registrar/getsections', {
          keyword: '',
          page: 1,
          pageSize: this.state.pageSize,
        })
        .then(res => {
          this.setState({
            isLoadingTable: false,
            numOfPages: res.data.numOfPages,
            data: res.data.sectionList,
          });
        });
    }
  };

  onChangeSearch(e) {
    this.setState({ keyword: e.target.value }, () => {
      this.setState({ isLoadingTable: true });
      const { selectedSearchBy } = this.state;
      if (selectedSearchBy == 'Teacher' || selectedSearchBy == 'Student') {
        axios
          .post(`api/registrar/getall${selectedSearchBy.toLowerCase()}s`, {
            keyword: this.state.keyword,
            page: 1,
            pageSize: this.state.pageSize,
          })
          .then(res => {
            this.setState({
              isLoadingTable: false,
              numOfPages: res.data.numOfPages,
              data: res.data.accountList,
            });
          })
          .catch(err => {
            this.setState({ isLoadingTable: false, data: [], numOfPages: 1 });
          });
      } else {
        axios
          .post('api/registrar/getsections', {
            keyword: this.state.keyword,
            page: 1,
            pageSize: this.state.pageSize,
          })
          .then(res => {
            this.setState({
              isLoadingTable: false,
              numOfPages: res.data.numOfPages,
              data: res.data.sectionList,
            });
          })
          .catch(err => {
            this.setState({ isLoadingTable: false, data: [], numOfPages: 1 });
          });
      }
    });
  }

  paginate = page => {
    this.setState({
      page,
    });
    this.setState({ isLoadingTable: true }, () => {
      const { selectedSearchBy } = this.state;
      if (selectedSearchBy == 'Teacher' || selectedSearchBy == 'Student') {
        axios
          .post(`api/registrar/getall${selectedSearchBy.toLowerCase()}s`, {
            keyword: this.state.keyword,
            page,
            pageSize: this.state.pageSize,
          })
          .then(res => {
            this.setState({
              isLoadingTable: false,
              numOfPages: res.data.numOfPages,
              data: res.data.accountList,
            });
          })
          .catch(err => {
            this.setState({ isLoadingTable: false, data: [], numOfPages: 1 });
          });
      } else {
        axios
          .post('api/registrar/getsections', {
            keyword: this.state.keyword,
            page,
            pageSize: this.state.pageSize,
          })
          .then(res => {
            this.setState({
              isLoadingTable: false,
              numOfPages: res.data.numOfPages,
              data: res.data.sectionList,
            });
          })
          .catch(err => {
            this.setState({ isLoadingTable: false, data: [], numOfPages: 1 });
          });
      }
    });
  };

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
    const schoolYearOptions = [];
    const displayData = [];
    for (const [index, value] of this.state.schoolYears.entries()) {
      schoolYearOptions.push(<option value={value.schoolYearID}>{value.schoolYear}</option>);
    }

    for (const [index, value] of this.state.data.entries()) {
      if (this.state.selectedSearchBy == 'Teacher' || this.state.selectedSearchBy == 'Student') {
        displayData.push(
          <Table.Row>
            <Table.Col className="w-1">
              <Avatar
                imageURL={value.imageUrl == 'NA' ? getPlaceholder() : getImageUrl(value.imageUrl)}
              />
            </Table.Col>
            <Table.Col>{value.name}</Table.Col>
            <Table.Col>{value.email}</Table.Col>
            <Table.Col>
              <Link
                to={`/viewstudentrecord/${this.state.selectedSearchBy.toLowerCase()}/${
                  value[`${this.state.selectedSearchBy.toLowerCase()}ID`]
                }/sy/${this.state.selectedSchoolYear}/q/${this.state.selectedQuarter}`}
              >
                <Button color="primary" icon="file" size="sm" pill>
                  View Grades
                </Button>
              </Link>
            </Table.Col>
          </Table.Row>,
        );
      } else {
        displayData.push(
          <Table.Row>
            <Table.Col>{value.name}</Table.Col>
            <Table.Col>{displayGradeLevel(value.gradeLevel)}</Table.Col>
            <Table.Col>
              <Link
                to={`/viewstudentrecord/section/${value.key}/sy/${this.state.selectedSchoolYear}/q/${this.state.selectedQuarter}`}
              >
                <Button color="primary" icon="file" size="sm" pill>
                  View Grades
                </Button>
              </Link>
            </Table.Col>
          </Table.Row>,
        );
      }
    }

    return (
      <div className="app-registrar-view-student-record card my-3 my-md-5">
        <Card.Body>
          <Card.Title>
            <Breadcrumb>
              <Breadcrumb.Item>View Student Records</Breadcrumb.Item>
              <Breadcrumb.Item>{this.state.selectedSearchBy}s List</Breadcrumb.Item>
            </Breadcrumb>
          </Card.Title>
          <Grid.Row>
            <Grid.Col sm={12} xs={12} md={12}>
              <Container>
                <Button.List align="right" style={{ marginBottom: '10px' }}>
                  <ViewHonorStudents />
                  <ViewFailedStudents />
                </Button.List>
              </Container>
            </Grid.Col>
          </Grid.Row>
          <Card.Title>View Student Records</Card.Title>
          <Container>
            <Spin spinning={this.state.isLoading}>
              <Grid.Row>
                <Grid.Col sm={12} xs={12} md={3}>
                  <Form.Group>
                    <Form.Label>Search by</Form.Label>
                    <Form.Select
                      onChange={e =>
                        this.setState({ selectedSearchBy: e.target.value }, () =>
                          this.handleDropdownChange(),
                        )
                      }
                    >
                      <option>Teacher</option>
                      <option>Section</option>
                      <option>Student</option>
                    </Form.Select>
                  </Form.Group>
                </Grid.Col>
                <Grid.Col sm={12} xs={12} md={5}>
                  <Form.Group>
                    <Form.Label>Select School Year</Form.Label>
                    <Form.Select
                      onChange={e => this.setState({ selectedSchoolYear: e.target.value })}
                    >
                      {schoolYearOptions}
                    </Form.Select>
                  </Form.Group>
                </Grid.Col>
                <Grid.Col sm={12} xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>Select Quarter</Form.Label>
                    <Form.Select onChange={e => this.setState({ selectedQuarter: e.target.value })}>
                      <option>Q1</option>
                      <option>Q2</option>
                      <option>Q3</option>
                      <option>Q4</option>
                    </Form.Select>
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
            </Spin>
          </Container>
          <Container>
            <Grid.Row>
              <Grid.Col sm={12} md={12} xs={12}>
                <Form.Group>
                  <Form.Input
                    icon="search"
                    placeholder="Search for..."
                    position="append"
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.onChangeSearch}
                  />
                </Form.Group>
              </Grid.Col>
            </Grid.Row>
            <Spin spinning={this.state.isLoadingTable}>
              <Grid.Row>
                <Table highlighRowOnHover={true} responsive={true}>
                  {this.state.selectedSearchBy == 'Teacher' && (
                    <Table.Header>
                      <Table.ColHeader></Table.ColHeader>
                      <Table.ColHeader>Teacher Name</Table.ColHeader>
                      <Table.ColHeader>Email</Table.ColHeader>
                      <Table.ColHeader>Action</Table.ColHeader>
                    </Table.Header>
                  )}
                  {this.state.selectedSearchBy == 'Student' && (
                    <Table.Header>
                      <Table.ColHeader></Table.ColHeader>
                      <Table.ColHeader>Student Name</Table.ColHeader>
                      <Table.ColHeader>Email</Table.ColHeader>
                      <Table.ColHeader>Action</Table.ColHeader>
                    </Table.Header>
                  )}
                  {this.state.selectedSearchBy == 'Section' && (
                    <Table.Header>
                      <Table.ColHeader>Section Name</Table.ColHeader>
                      <Table.ColHeader>Grade Level</Table.ColHeader>
                      <Table.ColHeader>Action</Table.ColHeader>
                    </Table.Header>
                  )}
                  <Table.Body>
                    {displayData.length == 0 ? (
                      this.selectedSearchBy == 'Section' ? (
                        <Table.Row>
                          <Table.Col colSpan={3} alignContent="center">
                            No entries.
                          </Table.Col>
                        </Table.Row>
                      ) : (
                        <Table.Row>
                          <Table.Col colSpan={4}>No entries.</Table.Col>
                        </Table.Row>
                      )
                    ) : (
                      displayData
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
              </Grid.Row>
            </Spin>
          </Container>
        </Card.Body>
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
)(RegistrarViewStudentRecord);
