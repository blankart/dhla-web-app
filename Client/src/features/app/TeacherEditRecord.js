import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
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
import { getImageUrl } from '../../utils';
const { Option } = AutoComplete;

export class TeacherEditRecord extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      componentID: 0,
      component: '',
      subcompName: '',
      subcompID: 0,
      isLoading: true,
      quarter: 'Q1',
      sectionName: '',
      subjectName: '',
      schoolYear: '',
      subjectCode: '',
      studList: [],
      dateGiven: new Date(),
      total: 0,
      recID: 0,
      subsectID: 0,
    };

    this.editRecord = this.editRecord.bind(this);
  }

  editRecord() {
    const {
      description,
      dateGiven,
      total,
      subsectID,
      subcompID,
      componentID,
      quarter,
      studList,
    } = this.state;
    const payload = studList;
    this.props.actions.editRecord(
      {
        description,
        dateGiven,
        total,
        subsectID,
        subcompID,
        componentID,
        quarter,
        payload,
      },
      'Teacher',
    );
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .post('api/teacher/getcomponents', {
        subsectID: this.props.subsectID,
        quarter: this.props.quarter,
      })
      .then(res => {
        this.setState({
          sectionName: res.data.sectionName,
          subjectName: res.data.subjectName,
          schoolYear: res.data.schoolYear,
          subjectCode: res.data.subjectCode,
        });
        axios
          .post('api/teacher/getrecinfo', {
            subsectID: this.props.subsectID,
            componentID: this.props.componentID,
            subcompID: this.props.subcompID,
            quarter: this.props.quarter,
            gradeID: this.props.rec,
          })
          .then(res => {
            this.setState({
              componentID: res.data.componentID,
              component: res.data.component,
              subcompName: res.data.subcompName,
              subcompID: res.data.subcompID,
              dateGiven: res.data.dateGiven,
              total: res.data.total,
              description: res.data.description,
              studList: res.data.data,
              isLoading: false,
              subsectID: this.props.subsectID,
              quarter: this.props.quarter,
              recID: this.props.rec,
            });
          });
      });
  }

  render() {
    const birthDate = new Date(this.state.dateGiven);
    const defaultDate = birthDate.toISOString();
    let tableData = [];
    for (const [index, value] of this.state.studList.entries()) {
      tableData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar imageURL={value.imageUrl == 'NA' ? placeholder : getImageUrl(value.imageUrl)} />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>
            <Form.Group>
              <Form.Input
                placeholder="Score"
                position="append"
                value={value.score}
                onChange={e => {
                  const reg = /^-?[0-9]*(\.[0-9]*)?$/;
                  let temparr = this.state.studList;

                  if (
                    (!isNaN(e.target.value) && reg.test(e.target.value)) ||
                    (e.target.value === '' && e.target.value !== '-') ||
                    e.target.value == 'A' ||
                    e.target.value == 'E'
                  ) {
                    temparr[index].score = e.target.value;
                    this.setState({ studList: temparr });
                  }
                }}
              />
            </Form.Group>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-teacher-add-record my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Card>
              <Card.Body>
                {this.state.isLoading ? (
                  <Spin spinning={true}></Spin>
                ) : (
                  <div>
                    <Card.Title>
                      <Breadcrumb>
                        <Breadcrumb.Item>Subjects</Breadcrumb.Item>
                        <Breadcrumb.Item>View Subject Load</Breadcrumb.Item>
                        <Breadcrumb.Item>Manage Grades</Breadcrumb.Item>
                        <Breadcrumb.Item>
                          {this.state.sectionName} - {this.state.subjectName}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.component}</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.subcompName}</Breadcrumb.Item>
                      </Breadcrumb>
                    </Card.Title>
                    <Card.Title>
                      <Header.H3>
                        {this.state.component} - {this.state.subcompName} - {this.state.description}
                      </Header.H3>
                    </Card.Title>
                    <Card.Title>
                      <Text.Small>
                        {this.state.sectionName} S.Y. {this.state.schoolYear}
                      </Text.Small>
                    </Card.Title>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col sm={12} xs={12} md={6}>
              <Spin spinning={this.state.isLoading}>
                <Card>
                  <Card.Body>
                    <Grid.Row>
                      <Grid.Col sm={12} xs={12} md={12}>
                        <Descriptions
                          style={{ marginBottom: '15px', marginTop: '15px' }}
                          bordered
                          title="Edit Record"
                        >
                          <Descriptions.Item span={3} label="Item Description">
                            <Form.Group>
                              <Form.Input
                                placeholder="Description"
                                value={this.state.description}
                                onChange={e => {
                                  this.setState({ description: e.target.value });
                                }}
                              />
                            </Form.Group>
                          </Descriptions.Item>
                          <Descriptions.Item span={3} label="Date Given">
                            <Form.Group>
                              <Form.DatePicker
                                defaultDate={new Date(defaultDate)}
                                format="mm/dd/yyyy"
                                onChange={e => {
                                  this.setState({ dateGiven: e });
                                }}
                                name="birthDate"
                                maxYear={2020}
                                minYear={1897}
                                monthLabels={[
                                  'January',
                                  'February',
                                  'March',
                                  'April',
                                  'May',
                                  'June',
                                  'July',
                                  'August',
                                  'September',
                                  'October',
                                  'November',
                                  'December',
                                ]}
                              ></Form.DatePicker>
                            </Form.Group>
                          </Descriptions.Item>
                          <Descriptions.Item span={3} label="Total number of items">
                            <Form.Group>
                              <Form.Input
                                placeholder="Total"
                                value={this.state.total}
                                onChange={e => {
                                  const reg = /^-?[0-9]*(\.[0-9]*)?$/;

                                  if (
                                    (!isNaN(e.target.value) && reg.test(e.target.value)) ||
                                    e.target.value === '' ||
                                    e.target.value === '-'
                                  ) {
                                    this.setState({ total: e.target.value });
                                  }
                                }}
                              />
                            </Form.Group>
                          </Descriptions.Item>
                        </Descriptions>
                      </Grid.Col>
                    </Grid.Row>
                  </Card.Body>
                </Card>
              </Spin>
            </Grid.Col>
            <Grid.Col sm={12} xs={12} md={6}>
              <Spin spinning={this.state.isLoading}>
                <Card>
                  <Card.Body>
                    <Card.Title>Student Scores</Card.Title>
                    <Container>
                      <Alert type="primary">
                        <b>Note:</b> Scores with value of <b>E</b> are considered{' '}
                        <i>
                          <b>excused</b>
                        </i>
                        . Enter a value of <b>A</b> for students who are{' '}
                        <i>
                          <b>absent</b>
                        </i>
                        .
                      </Alert>
                    </Container>
                    <Table highlightRowOnHover={true} responsive={true}>
                      <Table.Header>
                        <Table.ColHeader colSpan={2}>Student Name</Table.ColHeader>
                        <Table.ColHeader>Score</Table.ColHeader>
                      </Table.Header>
                      <Table.Body>{tableData}</Table.Body>
                    </Table>
                  </Card.Body>
                  <Card.Footer>
                    <Button.List align="right">
                      <Button icon="file" color="success" onClick={this.editRecord}>
                        Edit Record
                      </Button>
                    </Button.List>
                  </Card.Footer>
                </Card>
              </Spin>
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

export default connect(mapStateToProps, mapDispatchToProps)(TeacherEditRecord);
