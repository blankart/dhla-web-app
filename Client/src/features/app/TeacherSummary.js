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
  Tag,
  Badge,
} from 'tabler-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils';
const { Option } = AutoComplete;

export class TeacherSummary extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      subsectID: 0,
      subjectName: '',
      subjectCode: '',
      sectionName: '',
      schoolYear: '',
      schoolYearID: '',
      data: [],
      q1Transmu: '',
      q2Transmu: '',
      q3Transmu: '',
      q4Transmu: '',
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios.post('api/teacher/getsummary', { subsectID: this.props.subsectID }).then(res => {
      const {
        subjectName,
        subjectCode,
        sectionName,
        schoolYear,
        schoolYearID,
        data,
        q1Transmu,
        q2Transmu,
        q3Transmu,
        q4Transmu,
      } = res.data;
      this.setState({
        subjectName,
        subjectCode,
        sectionName,
        schoolYear,
        schoolYearID,
        data,
        q1Transmu,
        q2Transmu,
        q3Transmu,
        q4Transmu,
        isLoading: false,
        subsectID: this.props.subsectID,
      });
    });
  }

  render() {
    const color = trans => {
      switch (trans) {
        case '50': {
          return 'Yellow';
          break;
        }
        case '55': {
          return 'Orange';
          break;
        }
        case '60': {
          return 'Green';
          break;
        }
        default:
          break;
      }
    };
    let displayData = [];
    for (const [index, value] of this.state.data.entries()) {
      displayData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar imageURL={value.imageUrl == 'NA' ? placeholder : getImageUrl(value.imageUrl)} />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col alignContent="center">
            <b>
              {value.q1FinalGrade == -1
                ? 'Not yet available'
                : Number(Math.round(value.q1FinalGrade + 'e2') + 'e-2')}
            </b>
          </Table.Col>
          <Table.Col alignContent="center">
            <b>
              {value.q2FinalGrade == -1
                ? 'Not yet available'
                : Number(Math.round(value.q2FinalGrade + 'e2') + 'e-2')}
            </b>
          </Table.Col>
          <Table.Col alignContent="center">
            <b>
              {value.q3FinalGrade == -1
                ? 'Not yet available'
                : Number(Math.round(value.q3FinalGrade + 'e2') + 'e-2')}
            </b>
          </Table.Col>
          <Table.Col alignContent="center">
            <b>
              {value.q4FinalGrade == -1
                ? 'Not yet available'
                : Number(Math.round(value.q4FinalGrade + 'e2') + 'e-2')}
            </b>
          </Table.Col>
          <Table.Col alignContent="center">
            <b>
              {value.ave == -1 ? 'Not yet available' : Number(Math.round(value.ave + 'e2') + 'e-2')}
            </b>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-teacher-summary my-3 my-md-5">
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
                    <Breadcrumb.Item>Summary Report</Breadcrumb.Item>
                    <Breadcrumb.Item>
                      {this.state.sectionName} - {this.state.subjectName}
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </Card.Title>
                <Card.Title>
                  <Header.H3>
                    {this.state.subjectCode} - {this.state.subjectName} S.Y. {this.state.schoolYear}
                  </Header.H3>
                </Card.Title>
                <Card.Title>
                  <Text.Small>
                    {this.state.sectionName} S.Y. {this.state.schoolYear}
                  </Text.Small>
                  <Grid.Row>
                    <Grid.Col xs={12} sm={12} md={6}>
                      <Descriptions
                        style={{ marginBottom: '15px', marginTop: '15px' }}
                        bordered
                        title="Frequency Destribution"
                      >
                        <Descriptions.Item span={3} label="95-100">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.ave = sum.ave + val.ave;
                              return tempobj;
                            }).ave,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(val => val.ave >= 95 && val.ave <= 100).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="90-94">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.ave = sum.ave + val.ave;
                              return tempobj;
                            }).ave,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(val => val.ave >= 90 && val.ave < 95).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="85-89">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.ave = sum.ave + val.ave;
                              return tempobj;
                            }).ave,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(val => val.ave >= 85 && val.ave < 90).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="80-84">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.ave = sum.ave + val.ave;
                              return tempobj;
                            }).ave,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(val => val.ave >= 80 && val.ave < 85).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="75-79">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.ave = sum.ave + val.ave;
                              return tempobj;
                            }).ave,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(val => val.ave >= 75 && val.ave < 80).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Below 75">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.ave = sum.ave + val.ave;
                              return tempobj;
                            }).ave,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(val => val.ave < 75).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                      </Descriptions>
                    </Grid.Col>
                    <Grid.Col xs={12} sm={12} md={6}>
                      <Descriptions
                        style={{ marginBottom: '15px', marginTop: '15px' }}
                        bordered
                        title="Average"
                      >
                        <Descriptions.Item span={3} label="Quarter 1 Grade">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.q1FinalGrade = sum.q1FinalGrade + val.q1FinalGrade;
                              return tempobj;
                            }).q1FinalGrade,
                          ) /
                            this.state.data.length !=
                            -1
                            ? parseFloat(
                                this.state.data.reduce((sum, val) => {
                                  const tempobj = JSON.parse(JSON.stringify(sum));
                                  tempobj.q1FinalGrade = sum.q1FinalGrade + val.q1FinalGrade;
                                  return tempobj;
                                }).q1FinalGrade,
                              ) / this.state.data.length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Quarter 2 Grade">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.q2FinalGrade = sum.q2FinalGrade + val.q2FinalGrade;
                              return tempobj;
                            }).q2FinalGrade,
                          ) /
                            this.state.data.length !=
                            -1
                            ? parseFloat(
                                this.state.data.reduce((sum, val) => {
                                  const tempobj = JSON.parse(JSON.stringify(sum));
                                  tempobj.q2FinalGrade = sum.q2FinalGrade + val.q2FinalGrade;
                                  return tempobj;
                                }).q2FinalGrade,
                              ) / this.state.data.length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Quarter 3 Grade">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.q3FinalGrade = sum.q3FinalGrade + val.q3FinalGrade;
                              return tempobj;
                            }).q3FinalGrade,
                          ) /
                            this.state.data.length !=
                            -1
                            ? parseFloat(
                                this.state.data.reduce((sum, val) => {
                                  const tempobj = JSON.parse(JSON.stringify(sum));
                                  tempobj.q3FinalGrade = sum.q3FinalGrade + val.q3FinalGrade;
                                  return tempobj;
                                }).q3FinalGrade,
                              ) / this.state.data.length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Quarter 4 Grade">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.q4FinalGrade = sum.q4FinalGrade + val.q4FinalGrade;
                              return tempobj;
                            }).q4FinalGrade,
                          ) /
                            this.state.data.length !=
                            -1
                            ? parseFloat(
                                this.state.data.reduce((sum, val) => {
                                  const tempobj = JSON.parse(JSON.stringify(sum));
                                  tempobj.q4FinalGrade = sum.q4FinalGrade + val.q4FinalGrade;
                                  return tempobj;
                                }).q4FinalGrade,
                              ) / this.state.data.length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Final Grade">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.ave = sum.ave + val.ave;
                              return tempobj;
                            }).ave,
                          ) /
                            this.state.data.length !=
                            -1
                            ? parseFloat(
                                this.state.data.reduce((sum, val) => {
                                  const tempobj = JSON.parse(JSON.stringify(sum));
                                  tempobj.ave = sum.ave + val.ave;
                                  return tempobj;
                                }).ave,
                              ) / this.state.data.length
                            : 'Not yet available'}
                        </Descriptions.Item>
                      </Descriptions>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Title>
              </div>
            )}
          </Card.Body>
          <Card.Body>
            <Grid.Row>
              <Grid.Col xs={12} md={12} sm={12}>
                {this.state.isLoading ? (
                  <Spin spinning={true} />
                ) : (
                  <Table responsive={true} highlightRowOnHover={true}>
                    <Table.Header>
                      <Table.ColHeader colSpan={2}>Student Name</Table.ColHeader>
                      {/* <Table.ColHeader alignContent="center">Formative Assessment</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Written Works</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Performance Tasks</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Quarterly Assessment</Table.ColHeader> */}
                      <Table.ColHeader alignContent="center">
                        Q1 Final Grade{' '}
                        <Tag color={color(this.state.q1Transmu).toLowerCase()}>
                          {color(this.state.q1Transmu)}
                        </Tag>
                      </Table.ColHeader>
                      <Table.ColHeader alignContent="center">
                        Q2 Final Grade{' '}
                        <Tag color={color(this.state.q2Transmu).toLowerCase()}>
                          {color(this.state.q2Transmu)}
                        </Tag>
                      </Table.ColHeader>
                      <Table.ColHeader alignContent="center">
                        Q3 Final Grade{' '}
                        <Tag color={color(this.state.q3Transmu).toLowerCase()}>
                          {color(this.state.q3Transmu)}
                        </Tag>
                      </Table.ColHeader>
                      <Table.ColHeader alignContent="center">
                        Q4 Final Grade{' '}
                        <Tag color={color(this.state.q4Transmu).toLowerCase()}>
                          {color(this.state.q4Transmu)}
                        </Tag>
                      </Table.ColHeader>
                      <Table.ColHeader alignContent="center">Final Grade</Table.ColHeader>
                    </Table.Header>
                    <Table.Body>{displayData}</Table.Body>
                  </Table>
                )}
              </Grid.Col>
            </Grid.Row>
          </Card.Body>
        </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(TeacherSummary);
