import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import axios from 'axios';
import { Pagination, Spin, Tooltip } from 'antd';
import { Modal, Popconfirm, Search, Breadcrumb, AutoComplete, Input, message } from 'antd';
import RegistrarAddNewLoad from './RegistrarAddNewLoad';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import { Link } from 'react-router-dom';
const { Option } = AutoComplete;

export class TeacherViewSubjectLoad extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingTable: true,
      data: [],
      schoolYearID: 0,
      schoolYear: '',
      page: 1,
      pageSize: 10,
      numOfPages: 1,
      schoolYearList: [],
      selectedSchoolYearID: -1,
      selectedQuarter: 'Q1',
    };
  }

  onDropdownChange = () => {
    this.setState({ isLoadingTable: true });
    axios
      .post('api/teacher/getsubjectload', {
        schoolYearID: this.state.selectedSchoolYearID,
        quarter: this.state.selectedQuarter,
        page: this.state.page,
        pageSize: this.state.pageSize,
      })
      .then(res2 => {
        this.setState({
          isLoadingTable: false,
          data: res2.data.subjectSectionData,
          numOfPages: res2.data.numOfPages,
        });
      })
      .catch(err => {
        this.setState({ isLoadingTable: false, data: [] });
      });
  };

  componentDidMount() {
    axios.get('api/teacher/getsy').then(res => {
      axios.get('api/teacher/getallsy').then(res3 => {
        this.setState(
          {
            isLoading: false,
            schoolYear: res.data.schoolYear,
            schoolYearID: res.data.schoolYearID,
            schoolYearList: res3.data.schoolYearList,
            selectedSchoolYearID: res3.data.schoolYearList[0].schoolYearID,
          },
          () => {
            axios
              .post('api/teacher/getsubjectload', {
                schoolYearID: this.state.selectedSchoolYearID,
                quarter: this.state.selectedQuarter,
                page: this.state.page,
                pageSize: this.state.pageSize,
              })
              .then(res2 => {
                this.setState({
                  isLoadingTable: false,
                  data: res2.data.subjectSectionData,
                  numOfPages: res2.data.numOfPages,
                });
              })
              .catch(err => {
                this.setState({ isLoadingTable: false, data: [] });
              });
          },
        );
      });
    });
  }

  paginate = page => {
    this.setState({
      page,
    });
    this.setState({ isLoadingTable: true });
    axios
      .post('api/teacher/getsubjectload', {
        page,
        pageSize: this.state.pageSize,
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
            <Link to={`/viewsubjectload/${value.key}/${this.state.selectedQuarter}`}>
              <Button pill size="sm" icon="user" color="primary">
                View information
              </Button>
            </Link>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-teacher-view-subject-load my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col sm={12} lg={12}>
              <Grid.Row>
                <Card>
                  <Card.Body>
                    {this.state.isLoading ? (
                      ''
                    ) : (
                      <div>
                        <Card.Title>
                          <Breadcrumb>
                            <Breadcrumb.Item>Subjects</Breadcrumb.Item>
                            <Breadcrumb.Item>View Subject Load</Breadcrumb.Item>
                          </Breadcrumb>
                        </Card.Title>
                        <Card.Title>Subject Load List</Card.Title>
                      </div>
                    )}
                    <Grid.Row>
                      <Grid.Col sm={12} xs={12} md={7}>
                        <Form.Group>
                          <Form.Label>Select School Year</Form.Label>
                          <Form.Select
                            value={this.state.selectedSchoolYearID}
                            onChange={e =>
                              this.setState({ selectedSchoolYearID: e.target.value }, () =>
                                this.onDropdownChange(),
                              )
                            }
                            disabled={this.state.schoolYearList.length == 0}
                          >
                            {this.state.schoolYearList.map(a => (
                              <option value={a.schoolYearID}>{a.schoolYear}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} xs={12} md={5}>
                        <Form.Group>
                          <Form.Label>Select Quarter</Form.Label>
                          <Form.Select
                            value={this.state.selectedQuarter}
                            onChange={e =>
                              this.setState({ selectedQuarter: e.target.value }, () =>
                                this.onDropdownChange(),
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

export default connect(mapStateToProps, mapDispatchToProps)(TeacherViewSubjectLoad);
