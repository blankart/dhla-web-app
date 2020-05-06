import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Table, Container, Form, Avatar } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip, Modal } from 'antd';
import AllStudentDeliberationGrades from './AllStudentDeliberationGrades';
import placeholder from '../../images/placeholder.jpg';
import { getImageUrl } from '../../utils';

export class RegistrarGroupDeliberationInfo extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingTable: true,
      isLoadingTable2: true,
      isLoadingTable3: true,
      name: '',
      email: '',
      accountID: '',
      imageUrl: '',
      data: [],
      data2: [],
      data3: [],
      columns: [],
      schoolYearID: 0,
      schoolYear: '',
      page: 1,
      keyword: '',
      pageSize: 10,
      pageSize2: 10,
      numOfPages2: 1,
      page2: 1,
      numOfPages: 1,
      deadline: '',
      selectedClassRecordID: -1,
      selectedSubjectCode: '',
      selectedSubjectName: '',
      selectedSection: '',
      selectedDeadline: '',
      quarter: 'Q1',
      sectionName: '',
    };
  }

  handlePostGrade = () => {
    Modal.confirm({
      title: 'Post Grades',
      content:
        'Do you want to post this class record? Once posted, it will be accessed by the students enrolled in the subject.',
      okText: 'Post',
      cancelText: 'Cancel',
      onCancel: () => {},
      onOk: () => {
        this.props.actions.postClassRecord(
          {
            classRecordID: this.state.selectedClassRecordID,
            quarter: this.state.quarter,
          },
          () => {},
        );
      },
    });
  };

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
      axios
        .post('api/registrar/getsubmittedsubsectbysectionid', {
          sectionID: this.props.id,
          page: this.state.page,
          pageSize: this.state.pageSize,
          quarter: res.data.quarter,
        })
        .then(res2 => {
          this.setState({
            sectionName: res2.data.sectionName,
            data: res2.data.classRecordList,
            numOfPages: res2.data.numOfPages,
            isLoadingTable: false,
          });
        })
        .catch(err => {
          this.setState({ data: [], numOfPages: 1, isLoadingTable: false });
        });
      axios
        .post('api/registrar/getnotsubmittedsubsectbysectionid', {
          sectionID: this.props.id,
          page: this.state.page2,
          pageSize: this.state.pageSize2,
          quarter: res.data.quarter,
        })
        .then(res3 => {
          this.setState({
            data2: res3.data.classRecordList,
            numOfPages2: res3.data.numOfPages,
            isLoadingTable2: false,
          });
        })
        .catch(err => {
          this.setState({ data2: [], numOfPages2: 1, isLoadingTable2: false });
        });
      axios
        .post('api/registrar/condenseddeliberationgrade', {
          sectionID: this.props.id,
          quarter: res.data.quarter,
        })
        .then(res3 => {
          this.setState({
            isLoadingTable3: false,
            data3: res3.data.data,
            columns: res3.data.columns,
          });
        });
    });
  }

  handleChangeQuarter = () => {
    this.setState({ isLoadingTable: true, isLoadingTable2: true });
    axios
      .post('api/registrar/getsubmittedsubsectbysectionid', {
        sectionID: this.props.id,
        page: this.state.page,
        pageSize: this.state.pageSize,
        quarter: this.state.quarter,
      })
      .then(res2 => {
        this.setState({
          data: res2.data.classRecordList,
          numOfPages: res2.data.numOfPages,
          isLoadingTable: false,
        });
      })
      .catch(err => {
        this.setState({ data: [], numOfPages: 1, isLoadingTable: false });
      });
    axios
      .post('api/registrar/getnotsubmittedsubsectbysectionid', {
        sectionID: this.props.id,
        page: this.state.page2,
        pageSize: this.state.pageSize2,
        quarter: this.state.quarter,
      })
      .then(res3 => {
        this.setState({
          data2: res3.data.classRecordList,
          numOfPages2: res3.data.numOfPages,
          isLoadingTable2: false,
        });
      })
      .catch(err => {
        this.setState({ data2: [], numOfPages2: 1, isLoadingTable2: false });
      });
  };

  componentWillReceiveProps() {
    axios
      .post('api/registrar/getsubmittedsubsectbysectionid', {
        sectionID: this.props.id,
        page: this.state.page,
        pageSize: this.state.pageSize,
        quarter: this.state.quarter,
      })
      .then(res2 => {
        this.setState({
          data: res2.data.classRecordList,
          numOfPages: res2.data.numOfPages,
          isLoadingTable: false,
        });
      })
      .catch(err => {
        this.setState({ data: [], numOfPages: 1, isLoadingTable: false });
      });
    axios
      .post('api/registrar/getnotsubmittedsubsectbysectionid', {
        sectionID: this.props.id,
        page: this.state.page2,
        pageSize: this.state.pageSize2,
        quarter: this.state.quarter,
      })
      .then(res3 => {
        this.setState({
          data2: res3.data.classRecordList,
          numOfPages2: res3.data.numOfPages,
          isLoadingTable2: false,
        });
      })
      .catch(err => {
        this.setState({ data2: [], numOfPages2: 1, isLoadingTable2: false });
      });
  }

  paginate = page => {
    this.setState({ page, isLoadingTable: true }, async () => {
      axios
        .post('api/registrar/getsubmittedsubsectbysectionid', {
          sectionID: this.props.id,
          page: page,
          pageSize: this.state.pageSize,
          quarter: this.state.quarter,
        })
        .then(res2 => {
          this.setState({
            data: res2.data.classRecordList,
            numOfPages: res2.data.numOfPages,
            isLoadingTable: false,
          });
        })
        .catch(err => {
          this.setState({ data: [], numOfPages: 1, isLoadingTable: false });
        });
    });
  };

  paginate2 = page => {
    this.setState({ page2: page, isLoadingTable2: true }, async () => {
      axios
        .post('api/registrar/getnotsubmittedsubsectbysectionid', {
          sectionID: this.props.id,
          page: page,
          pageSize: this.state.pageSize2,
          quarter: this.state.quarter,
        })
        .then(res2 => {
          this.setState({
            data2: res2.data.classRecordList,
            numOfPages2: res2.data.numOfPages,
            isLoadingTable2: false,
          });
        })
        .catch(err => {
          this.setState({ data2: [], numOfPages2: 1, isLoadingTable2: false });
        });
    });
  };

  render() {
    const DisplayColumns = [];
    DisplayColumns.push(<Table.ColHeader></Table.ColHeader>);
    DisplayColumns.push(<Table.ColHeader>Name</Table.ColHeader>);
    const DisplayData = [];
    const DisplayData2 = [];
    const DisplayData3 = [];
    for (const [index, value] of this.state.data3.entries()) {
      let tempCol = [];
      for (const [index2, value2] of value.grades.entries()) {
        tempCol.push(
          <Table.Col>
            {value2.grade == -1 ? 'N/A' : value2.grade == 'N/A' ? 'Not enrolled' : value2.grade}
          </Table.Col>,
        );
      }
      DisplayData3.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar imageURL={value.imageUrl == 'NA' ? placeholder : getImageUrl(value.imageUrl)} />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          {tempCol}
          <Table.Col>
            <Tooltip placement="top" title="View all grades">
              <AllStudentDeliberationGrades name={value.name} studsectID={value.studsectID} />
            </Tooltip>
          </Table.Col>
        </Table.Row>,
      );
    }
    for (const [index, value] of this.state.columns.entries()) {
      DisplayColumns.push(<Table.ColHeader>{value}</Table.ColHeader>);
    }
    DisplayColumns.push(<Table.ColHeader>Actions</Table.ColHeader>);
    for (const [index, value] of this.state.data.entries()) {
      const dateSubmitted = new Date(value.dateSubmitted);
      let status = '';
      if (value.deadline == 'NOT SET') {
        status = 'NOT SET';
      } else {
        let deadline = new Date(value.deadline);
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
          <Table.Col>{value.teacher}</Table.Col>
          <Table.Col>
            <Tooltip placement="top" title="View Class Record">
              <Link
                to={`/individualdeliberation/${this.props.id}/managegrade/${value.classRecordID}/quarter/${this.state.quarter}`}
                target="_blank"
              >
                <Button icon="eye" size="sm" pill color="primary"></Button>
              </Link>
            </Tooltip>
            <span style={{ marginLeft: '2px' }}>
              <Tooltip placement="top" title="Post Grade">
                <Button
                  icon="check"
                  size="sm"
                  pill
                  color="success"
                  onClick={() =>
                    this.setState({ selectedClassRecordID: value.classRecordID }, () =>
                      this.handlePostGrade(),
                    )
                  }
                ></Button>
              </Tooltip>
            </span>
          </Table.Col>
        </Table.Row>,
      );
    }
    for (const [index, value] of this.state.data2.entries()) {
      const displayDate = new Date(value.deadline);
      DisplayData2.push(
        <Table.Row>
          <Table.Col>{value.subjectCode}</Table.Col>
          <Table.Col>{value.teacher}</Table.Col>
          <Table.Col>{displayDate.toDateString()}</Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-registrar-individual-deliberation-info my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col sm={12} lg={5}>
              <Grid.Row>
                <Container>
                  {this.state.isLoading ? (
                    ''
                  ) : (
                    <Card statusColor="warning">
                      <Card.Body>
                        <Card.Title>
                          Class Record of {this.state.sectionName} S.Y. {this.state.schoolYear}
                        </Card.Title>
                        <Grid.Row>
                          <Grid.Col sm={12} md={12} xs={12}>
                            <Form.Group>
                              <Form.Label>Select Quarter</Form.Label>
                              <Form.Select
                                onChange={e =>
                                  this.setState({ quarter: e.target.value }, () =>
                                    this.handleChangeQuarter(),
                                  )
                                }
                                value={this.state.quarter}
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
                                  <Table.ColHeader>Subject</Table.ColHeader>
                                  <Table.ColHeader>Teacher</Table.ColHeader>
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
                <Container>
                  {this.state.isLoading ? (
                    ''
                  ) : (
                    <Card statusColor="danger">
                      <Card.Body>
                        <Card.Title>
                          List of subjects which are{' '}
                          <b>
                            <i>not</i>
                          </b>{' '}
                          yet submitted for deliberation
                        </Card.Title>
                        <Grid.Row>
                          <Grid.Col sm={12} md={12} xs={12}>
                            <Spin spinning={this.state.isLoadingTable}>
                              <Table highlightRowOnHover={true} responsive={true}>
                                <Table.Header>
                                  <Table.ColHeader>Subject</Table.ColHeader>
                                  <Table.ColHeader>Teacher</Table.ColHeader>
                                  <Table.ColHeader>Deadline</Table.ColHeader>
                                </Table.Header>
                                <Table.Body>
                                  {DisplayData2.length == 0 ? (
                                    <Table.Row>
                                      <Table.Col colSpan={5} alignContent="center">
                                        No entries.
                                      </Table.Col>
                                    </Table.Row>
                                  ) : (
                                    DisplayData2
                                  )}
                                </Table.Body>
                              </Table>
                              <Pagination
                                size="large"
                                current={this.state.page2}
                                pageSize={this.state.pageSize2}
                                total={this.state.pageSize2 * this.state.numOfPages2}
                                onChange={this.paginate2}
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
            <Grid.Col sm={12} sm={7}>
              <Grid.Row>
                <Container>
                  <Card statusColor="info">
                    <Card.Body>
                      <Card.Title>Condensed Grades of {this.state.sectionName}</Card.Title>
                    </Card.Body>
                    <Card.Body>
                      <Spin spinning={this.state.isLoadingTable3}>
                        <Grid.Row>
                          <Table highlightRowOnHover={true} responsive={true}>
                            <Table.Header>{DisplayColumns}</Table.Header>
                            <Table.Body>{DisplayData3}</Table.Body>
                          </Table>
                        </Grid.Row>
                      </Spin>
                    </Card.Body>
                  </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarGroupDeliberationInfo);
