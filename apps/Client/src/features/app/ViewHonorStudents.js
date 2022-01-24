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

export class ViewHonorStudents extends Component {
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
      selectedGradeLevel: 'N',
      selectedSection: [],
      data: [],
      numOfHonors: 'N/A',
      honorInfo: [],
    };
  }

  refetch = () => {
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/gethonorstudents', {
        schoolYearID: this.state.selectedSchoolYear,
        gradeLevel: this.state.selectedGradeLevel,
      })
      .then(res2 => {
        this.setState({
          isLoadingTable: false,
          data: res2.data.data,
          numOfHonors: res2.data.numOfHonors,
        });
      })
      .catch(err => {
        this.setState({
          isLoadingTable: false,
          data: [],
          numOfHonors: 'N/A',
        });
      });
  };

  handleSchoolYearChange = () => {
    this.refetch();
  };

  handleGradeLevelChange = () => {
    this.refetch();
  };

  handleFetchHonorStudents = () => {
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
            .post('api/registrar/gethonorstudents', {
              schoolYearID: res.data.schoolYearList[0].schoolYearID,
              gradeLevel: 'N',
            })
            .then(res2 => {
              this.setState({
                isLoadingTable: false,
                data: res2.data.data,
                numOfHonors: res2.data.numOfHonors,
              });
            })
            .catch(err => {
              this.setState({
                isLoadingTable: false,
                data: [],
                numOfHonors: 'N/A',
              });
            });
        })
        .catch(err => {
          this.setState({
            schoolYears: [],
            selectedSchoolYear: -1,
            isLoading: false,
            numOfHonors: 'N/A',
          });
        });
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
    const DisplayData2 = [];
    for (const [index, value] of this.state.selectedSection.entries()) {
      DisplayData2.push(
        <Table.Row>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.grade}</Table.Col>
        </Table.Row>,
      );
    }
    for (const [index, value] of this.state.schoolYears.entries()) {
      schoolYearOptions.push(<option value={value.schoolYearID}>{value.schoolYear}</option>);
    }
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.numOfHonors}</Table.Col>
          <Table.Col>
            {value.honorInfo.length != 0 && (
              <Tooltip title="View honor students">
                <Button
                  icon="file"
                  color="primary"
                  size="sm"
                  pill
                  outline
                  onClick={() =>
                    this.setState({
                      selectedSection: JSON.parse(JSON.stringify(value.honorInfo)),
                      showModal2: true,
                    })
                  }
                ></Button>
              </Tooltip>
            )}
            <Tooltip title="View condensed grades">
              <Link
                to={`/viewstudentrecord/section/${value.sectionID}/sy/${this.state.selectedSchoolYear}/q/Q4`}
                target="_blank"
              >
                <Button icon="file" pill color="success" size="sm" outline></Button>
              </Link>
            </Tooltip>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <React.Fragment>
        <Modal
          title="View Honor Students"
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
                  <Table.ColHeader>Grade</Table.ColHeader>
                </Table.Header>
                <Table.Body>
                  {DisplayData2.length == 0 ? (
                    <Table.Row>
                      <Table.Col colSpan={3} alignContent="center">
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
          title="View Honor Students"
          visible={this.state.showModal}
          footer={[<Button onClick={() => this.setState({ showModal: false })}>Close</Button>]}
          onCancel={() =>
            this.setState({
              showModal: false,
              selectedGradeLevel: 'N',
              selectedSchoolYear: -1,
              data: [],
            })
          }
        >
          <Spin spinning={this.state.isLoading}>
            <Card statusColor="warning">
              <Card.Body>
                <Grid.Row>
                  <Alert icon="info" type="primary">
                    Note: It will display the number of honor students per school year and grade
                    level.
                  </Alert>
                  <Grid.Col sm={12} xs={12} md={6}>
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
                          <Table.ColHeader>Honor Students</Table.ColHeader>
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
                <Grid.Row>Number of honor students: {this.state.numOfHonors}</Grid.Row>
              </Card.Body>
            </Card>
          </Spin>
        </Modal>
        <Button
          icon="file"
          size="sm"
          pill
          color="success"
          onClick={() => this.setState({ showModal: true }, () => this.handleFetchHonorStudents())}
        >
          Honor Students
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
)(ViewHonorStudents);
