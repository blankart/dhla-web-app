import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container, Alert } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip, Descriptions } from 'antd';
import { Modal, Popconfirm, Search, Breadcrumb, AutoComplete, Input, message } from 'antd';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import bg from '../../images/BG.png';
import { getImageUrl, getPlaceholder } from '../../utils';
const { Option } = AutoComplete;

export class ViewFailedStudents extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showModal2: false,
      isLoading: true,
      isLoadingTable: true,
      schoolYears: [],
      sectionOption: [],
      selectedSchoolYear: '',
      selectedQuarter: 'Q1',
      selectedGradeLevel: 'N',
      selectedSection: [],
      data: [],
      numOfFailed: 'N/A',
    };
  }

  handleFailedStudents = () => {
    this.setState({ isLoading: true }, () => {
      axios
        .get('api/registrar/getallsy')
        .then(res => {
          this.setState({
            schoolYears: res.data.schoolYearList,
            selectedSchoolYear: res.data.schoolYearList[0].schoolYearID,
            isLoading: false,
          });
          axios
            .post('api/registrar/getpassedfailed', {
              schoolYearID: res.data.schoolYearList[0].schoolYearID,
              gradeLevel: 'N',
              quarter: 'Q1',
            })
            .then(res2 => {
              this.setState({
                isLoadingTable: false,
                data: res2.data.data,
                numOfFailed: res2.data.failed,
              });
            })
            .catch(err => {
              this.setState({
                isLoadingTable: false,
                data: [],
                numOfFailed: 'N/A',
              });
            });
        })
        .catch(err => {
          this.setState({
            schoolYears: [],
            selectedSchoolYear: -1,
            isLoading: false,
            numOfFailed: 'N/A',
          });
        });
    });
  };

  refetch = () => {
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/getpassedfailed', {
        schoolYearID: this.state.selectedSchoolYear,
        gradeLevel: this.state.selectedGradeLevel,
        quarter: this.state.selectedQuarter,
      })
      .then(res2 => {
        this.setState({
          isLoadingTable: false,
          data: res2.data.data,
          numOfFailed: res2.data.failed,
        });
      })
      .catch(err => {
        this.setState({
          isLoadingTable: false,
          data: [],
          numOfFailed: 'N/A',
        });
      });
  };

  handleSchoolYearChange = () => {
    this.refetch();
  };

  handleGradeLevelChange = () => {
    this.refetch();
  };

  handleQuarterChange = () => {
    this.refetch();
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
    const DisplayData2 = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.numOfPassed}</Table.Col>
          <Table.Col>{value.numOfFailed}</Table.Col>
          <Table.Col>
            {value.failedInfo.length != 0 && (
              <Tooltip title="View failed subjects">
                <Button
                  icon="file"
                  color="danger"
                  size="sm"
                  pill
                  outline
                  onClick={() =>
                    this.setState({
                      selectedSection: JSON.parse(JSON.stringify(value.failedInfo)),
                      showModal2: true,
                    })
                  }
                ></Button>
              </Tooltip>
            )}
            <Tooltip title="View condensed grades">
              <Link
                to={`/viewstudentrecord/section/${value.sectionID}/sy/${this.state.selectedSchoolYear}/q/${this.state.selectedQuarter}`}
                target="_blank"
              >
                <Button icon="file" pill color="success" size="sm" outline></Button>
              </Link>
            </Tooltip>
          </Table.Col>
        </Table.Row>,
      );
    }
    for (const [index, value] of this.state.selectedSection.entries()) {
      DisplayData2.push(
        <Table.Row>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.subjectName}</Table.Col>
          <Table.Col>{value.teacher}</Table.Col>
          <Table.Col>{value.grade}</Table.Col>
          <Table.Col>
            <Link
              to={`/viewstudentrecord/classrecord/${value.classRecordID}/q/${this.state.selectedQuarter} `}
              target="_blank"
            >
              <Button icon="eye" color="primary" size="sm">
                View Class Record
              </Button>
            </Link>
          </Table.Col>
        </Table.Row>,
      );
    }
    const schoolYearOptions = [];
    for (const [index, value] of this.state.schoolYears.entries()) {
      schoolYearOptions.push(<option value={value.schoolYearID}>{value.schoolYear}</option>);
    }
    return (
      <React.Fragment>
        <Modal
          title="View Section Information"
          visible={this.state.showModal2}
          footer={[<Button onClick={() => this.setState({ showModal2: false })}>Close</Button>]}
          onCancel={() => this.setState({ showModal2: false, selectedSection: [] })}
          width={700}
        >
          <Grid.Row>
            <Grid.Col sm={12} xs={12} md={12}>
              <Table highlightRowOnHover={true} responsive={true}>
                <Table.Header>
                  <Table.ColHeader>Student Name</Table.ColHeader>
                  <Table.ColHeader>Subject</Table.ColHeader>
                  <Table.ColHeader>Teacher</Table.ColHeader>
                  <Table.ColHeader>Grade</Table.ColHeader>
                  <Table.ColHeader>Action</Table.ColHeader>
                </Table.Header>
                <Table.Body>
                  {DisplayData2.length == 0 ? (
                    <Table.Row>
                      <Table.Col colSpan={5} alignContent="center">
                        No data.
                      </Table.Col>
                    </Table.Row>
                  ) : (
                    DisplayData2
                  )}
                </Table.Body>
              </Table>
            </Grid.Col>
          </Grid.Row>
        </Modal>
        <Modal
          title="View Passed/Failed Students"
          visible={this.state.showModal}
          footer={[<Button onClick={() => this.setState({ showModal: false })}>Close</Button>]}
          onCancel={() =>
            this.setState({
              showModal: false,
              selectedQuarter: 'Q1',
              data: [],
              selectedScholYear: -1,
              selectedGradeLevel: 'N',
              numOfFailed: 'N/A',
            })
          }
          width={700}
        >
          <Spin spinning={this.state.isLoading}>
            <Card statusColor="warning">
              <Card.Body>
                <Grid.Row>
                  <Alert icon="info" type="primary">
                    Note: It will display the number of students with passed/failed subjects per
                    section by school year, quarter, and grade level.
                  </Alert>
                  <Grid.Col sm={12} xs={12} md={12}>
                    <Form.Group>
                      <Form.Label>Select School Year</Form.Label>
                      <Form.Select
                        onChange={e =>
                          this.setState({ selectedSchoolYear: e.target.value }, () =>
                            this.handleSchoolYearChange(),
                          )
                        }
                      >
                        {schoolYearOptions}
                      </Form.Select>
                    </Form.Group>
                  </Grid.Col>
                  <Grid.Col sm={12} xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Select Quarter</Form.Label>
                      <Form.Select
                        onChange={e =>
                          this.setState({ selectedQuarter: e.target.value }, () =>
                            this.handleQuarterChange(),
                          )
                        }
                      >
                        <option>Q1</option>
                        <option>Q2</option>
                        <option>Q3</option>
                        <option>Q4</option>
                      </Form.Select>
                    </Form.Group>
                  </Grid.Col>
                  <Grid.Col sm={12} xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Grade Level</Form.Label>
                      <Form.Select
                        value={this.state.selectedGradeLevel}
                        onChange={e =>
                          this.setState({ selectedGradeLevel: e.target.value }, () =>
                            this.handleGradeLevelChange(),
                          )
                        }
                      >
                        <option value="N">Nursery</option>
                        <option value="K1">Kinder 1</option>
                        <option value="K2">Kinder 2</option>
                        <option value="G1">Grade 1</option>
                        <option value="G2">Grade 2</option>
                        <option value="G3">Grade 3</option>
                        <option value="G4">Grade 4</option>
                        <option value="G5">Grade 5</option>
                        <option value="G6">Grade 6</option>
                        <option value="G7">Grade 7</option>
                        <option value="G8">Grade 8</option>
                        <option value="G9">Grade 9</option>
                        <option value="G10">Grade 10</option>
                        <option value="G11">Grade 11</option>
                        <option value="G12">Grade 12</option>
                      </Form.Select>
                    </Form.Group>
                  </Grid.Col>
                </Grid.Row>
                <Spin spinning={this.state.isLoadingTable}>
                  {' '}
                  <Grid.Row>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Table highlightRowOnHover={true} responsive={true}>
                        <Table.Header>
                          <Table.ColHeader>Section</Table.ColHeader>
                          <Table.ColHeader>Passed</Table.ColHeader>
                          <Table.ColHeader>Failed</Table.ColHeader>
                          <Table.ColHeader>Actions</Table.ColHeader>
                        </Table.Header>
                        <Table.Body>
                          {DisplayData.length == 0 ? (
                            <Table.Row>
                              <Table.Col colSpan={4} alignContent="center">
                                No data.
                              </Table.Col>
                            </Table.Row>
                          ) : (
                            DisplayData
                          )}
                        </Table.Body>
                      </Table>
                    </Grid.Col>
                  </Grid.Row>
                </Spin>
              </Card.Body>
              <Card.Body>
                <Grid.Row>Number of failed students: {this.state.numOfFailed}</Grid.Row>
              </Card.Body>
            </Card>
          </Spin>
        </Modal>
        <Button
          icon="file"
          size="sm"
          pill
          color="info"
          onClick={() => this.setState({ showModal: true }, () => this.handleFailedStudents())}
        >
          Passed/Failed Students
        </Button>
      </React.Fragment>
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
)(ViewFailedStudents);
