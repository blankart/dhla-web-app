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
import { getImageUrl, getPlaceholder } from '../../utils';
import ViewEditLog from './ViewEditLog';
const { Option } = AutoComplete;

export class TeacherSummaryPerQuarter extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      subjectName: '',
      subjectCode: '',
      sectionName: '',
      schoolYearID: 0,
      schoolYear: '',
      data: [],
      quarter: 'Q1',
      subsectID: 0,
      transmutation: '50',
      trans: '50',
      subjectType: '',
      locked: true,
      classRecordID: -1,
    };

    this.changeTransmutation = this.changeTransmutation.bind(this);
  }

  changeTransmutation() {
    this.props.actions.changeTransmutation(
      {
        subsectID: this.state.subsectID,
        quarter: this.state.quarter,
        transmutation: this.state.transmutation,
      },
      'Teacher',
    );
  }

  componentWillReceiveProps() {
    this.setState({ isLoading: true });
    axios.post('api/teacher/getsubjecttype', { subsectID: this.props.subsectID }).then(res2 => {
      axios
        .post('api/teacher/getquartersummary', {
          subsectID: this.props.subsectID,
          quarter: this.props.quarter,
        })
        .then(res => {
          axios
            .post('api/teacher/ifclassrecordlocked', {
              classRecordID: res.data.classRecordID,
              quarter: this.props.quarter,
            })
            .then(res3 => {
              this.setState({
                isLoading: false,
                subjectName: res.data.subjectName,
                subjectCode: res.data.subjectCode,
                sectionName: res.data.sectionName,
                schoolYearID: res.data.schoolYearID,
                schoolYear: res.data.schoolYear,
                data: res.data.data,
                quarter: this.props.quarter,
                subsectID: this.props.subsectID,
                transmutation: res.data.transmutation,
                trans: res.data.transmutation,
                subjectType: res2.data.subjectType,
                locked: res3.data.locked,
                classRecordID: res.data.classRecordID,
              });
            });
        });
    });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios.post('api/teacher/getsubjecttype', { subsectID: this.props.subsectID }).then(res2 => {
      axios
        .post('api/teacher/getquartersummary', {
          subsectID: this.props.subsectID,
          quarter: this.props.quarter,
        })
        .then(res => {
          axios
            .post('api/teacher/ifclassrecordlocked', {
              classRecordID: res.data.classRecordID,
              quarter: this.props.quarter,
            })
            .then(res3 => {
              this.setState({
                isLoading: false,
                subjectName: res.data.subjectName,
                subjectCode: res.data.subjectCode,
                sectionName: res.data.sectionName,
                schoolYearID: res.data.schoolYearID,
                schoolYear: res.data.schoolYear,
                data: res.data.data,
                quarter: this.props.quarter,
                subsectID: this.props.subsectID,
                transmutation: res.data.transmutation,
                trans: res.data.transmutation,
                subjectType: res2.data.subjectType,
                locked: res3.data.locked,
                classRecordID: res.data.classRecordID,
              });
            });
        });
    });
  }

  render() {
    const { locked } = this.state;
    ('green');
    let displayData = [];
    for (const [index, value] of this.state.data.entries()) {
      displayData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar
              imageURL={value.imageUrl == 'NA' ? getPlaceholder() : getImageUrl(value.imageUrl)}
            />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          {/* <Table.Col alignContent="center">
            {value.faWS == -1 ? 'Not yet available' : Number(Math.round(value.faWS + 'e2') + 'e-2')}
          </Table.Col>
          <Table.Col alignContent="center">
            {value.wwWS == -1 ? 'Not yet available' : Number(Math.round(value.wwWS + 'e2') + 'e-2')}
          </Table.Col>
          <Table.Col alignContent="center">
            {value.ptWS == -1 ? 'Not yet available' : Number(Math.round(value.ptWS + 'e2') + 'e-2')}
          </Table.Col>
          <Table.Col alignContent="center">
            {value.qeWS == -1 ? 'Not yet available' : Number(Math.round(value.qeWS + 'e2') + 'e-2')}
          </Table.Col> */}
          <Table.Col alignContent="center">
            <b>
              {value.actualGrade == -1
                ? 'Not yet available'
                : Number(Math.round(value.actualGrade + 'e2') + 'e-2')}
            </b>
          </Table.Col>
          <Table.Col alignContent="center">
            {value.transmutedGrade50 == -1
              ? 'Not yet available'
              : Number(Math.round(value.transmutedGrade50 + 'e2') + 'e-2')}
          </Table.Col>
          <Table.Col alignContent="center">
            {value.transmutedGrade55 == -1
              ? 'Not yet available'
              : Number(Math.round(value.transmutedGrade55 + 'e2') + 'e-2')}
          </Table.Col>
          <Table.Col alignContent="center">
            {value.transmutedGrade60 == -1
              ? 'Not yet available'
              : Number(Math.round(value.transmutedGrade60 + 'e2') + 'e-2')}
          </Table.Col>
          <Table.Col style={{ color: 'red' }} alignContent="center">
            <b>
              <Text color={value.finalGrade < 75 ? 'red' : 'black'}>
                <span className={`status-icon bg-${value.finalGrade < 75 ? 'red' : 'green'} `} />
                {value.finalGrade == -1
                  ? 'Not yet available'
                  : Number(Math.round(value.finalGrade + 'e2') + 'e-2')}
              </Text>
            </b>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-teacher-summary-per-quarter my-3 my-md-5">
        <Card>
          <Card.Body>
            {this.state.isLoading ? (
              <Spin spinning={true}></Spin>
            ) : (
              <div>
                <Card.Title>
                  <Grid.Row>
                    <Grid.Col xs={12} sm={12} md={6}>
                      <Breadcrumb>
                        <Breadcrumb.Item>Subjects</Breadcrumb.Item>
                        <Breadcrumb.Item>View Subject Load</Breadcrumb.Item>
                        <Breadcrumb.Item>Summary Report</Breadcrumb.Item>
                        <Breadcrumb.Item>
                          {this.state.sectionName} - {this.state.subjectName}
                        </Breadcrumb.Item>
                      </Breadcrumb>
                    </Grid.Col>
                    <Grid.Col xs={12} sm={12} md={6}>
                      <Button.List align="right">
                        <Link to={`/summaryreportall/${this.state.subsectID}`}>
                          <Button icon="file" color="success">
                            View Summary Report
                          </Button>
                        </Link>
                      </Button.List>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Title>
                <Card.Title>
                  <Header.H3>
                    {this.state.subjectCode} - {this.state.subjectName}
                  </Header.H3>
                </Card.Title>
                <Card.Title>
                  <Text.Small>
                    {this.state.sectionName}{' '}
                    {this.state.subjectType == 'NON_SHS'
                      ? this.props.quarter
                      : this.props.quarter == 'Q1' || this.props.quarter == 'Q2'
                      ? 'FIRST SEMESTER'
                      : 'SECOND SEMESTER'}{' '}
                    S.Y. {this.state.schoolYear}
                  </Text.Small>
                  <Grid.Row>
                    <Grid.Col xs={12} sm={12} md={3}>
                      <Form.Select
                        onChange={e => {
                          this.setState({ quarter: e.target.value });
                        }}
                        value={this.state.quarter}
                      >
                        {this.state.subjectType == 'NON_SHS' ? (
                          <React.Fragment>
                            <option>Q1</option>
                            <option>Q2</option>
                            <option>Q3</option>
                            <option>Q4</option>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <option value={'Q1'}>Midterm</option>
                            <option value={'Q2'}>Finals</option>
                          </React.Fragment>
                        )}
                      </Form.Select>
                    </Grid.Col>
                    <Grid.Col xs={12} sm={12} md={3}>
                      <a href={`/summaryreport/${this.props.subsectID}/${this.state.quarter}`}>
                        <Button block color="primary">
                          Change
                        </Button>
                      </a>
                    </Grid.Col>
                    <Grid.Col xs={12} sm={12} md={3}>
                      {!locked && (
                        <Form.Select
                          onChange={e => {
                            this.setState({ transmutation: e.target.value });
                          }}
                          value={this.state.transmutation}
                        >
                          <option value="50">50% (Yellow)</option>
                          <option value="55">55% (Orange)</option>
                          <option value="60">60% (Green)</option>
                        </Form.Select>
                      )}
                    </Grid.Col>
                    <Grid.Col xs={12} sm={12} md={3}>
                      {!locked && (
                        <Button
                          color="primary"
                          block
                          onClick={() => {
                            this.changeTransmutation();
                          }}
                        >
                          Change Transmutation
                        </Button>
                      )}
                    </Grid.Col>
                  </Grid.Row>
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
                              tempobj.transmutedGrade60 =
                                sum.transmutedGrade60 + val.transmutedGrade60;
                              return tempobj;
                            }).transmutedGrade60,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(
                                val => val.finalGrade >= 95 && val.finalGrade <= 100,
                              ).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="90-94">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.transmutedGrade60 =
                                sum.transmutedGrade60 + val.transmutedGrade60;
                              return tempobj;
                            }).transmutedGrade60,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(
                                val => val.finalGrade >= 90 && val.finalGrade < 95,
                              ).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="85-89">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.transmutedGrade60 =
                                sum.transmutedGrade60 + val.transmutedGrade60;
                              return tempobj;
                            }).transmutedGrade60,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(
                                val => val.finalGrade >= 85 && val.finalGrade < 90,
                              ).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="80-84">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.transmutedGrade60 =
                                sum.transmutedGrade60 + val.transmutedGrade60;
                              return tempobj;
                            }).transmutedGrade60,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(
                                val => val.finalGrade >= 80 && val.finalGrade < 85,
                              ).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="75-79">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.transmutedGrade60 =
                                sum.transmutedGrade60 + val.transmutedGrade60;
                              return tempobj;
                            }).transmutedGrade60,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(
                                val => val.finalGrade >= 75 && val.finalGrade < 80,
                              ).length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Below 75">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.transmutedGrade60 =
                                sum.transmutedGrade60 + val.transmutedGrade60;
                              return tempobj;
                            }).transmutedGrade60,
                          ) /
                            this.state.data.length !=
                            -1
                            ? this.state.data.filter(val => val.finalGrade < 75).length
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
                        <Descriptions.Item span={3} label="Actual Grade">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.actualGrade = sum.actualGrade + val.actualGrade;
                              return tempobj;
                            }).actualGrade,
                          ) /
                            this.state.data.length !=
                            -1
                            ? parseFloat(
                                this.state.data.reduce((sum, val) => {
                                  const tempobj = JSON.parse(JSON.stringify(sum));
                                  tempobj.actualGrade = sum.actualGrade + val.actualGrade;
                                  return tempobj;
                                }).actualGrade,
                              ) / this.state.data.length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Transmutated Grade (50%)">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.transmutedGrade50 =
                                sum.transmutedGrade50 + val.transmutedGrade50;
                              return tempobj;
                            }).transmutedGrade50,
                          ) /
                            this.state.data.length !=
                            -1
                            ? parseFloat(
                                this.state.data.reduce((sum, val) => {
                                  const tempobj = JSON.parse(JSON.stringify(sum));
                                  tempobj.transmutedGrade50 =
                                    sum.transmutedGrade50 + val.transmutedGrade50;
                                  return tempobj;
                                }).transmutedGrade50,
                              ) / this.state.data.length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Transmutated Grade (55%)">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.transmutedGrade55 =
                                sum.transmutedGrade55 + val.transmutedGrade55;
                              return tempobj;
                            }).transmutedGrade55,
                          ) /
                            this.state.data.length !=
                            -1
                            ? parseFloat(
                                this.state.data.reduce((sum, val) => {
                                  const tempobj = JSON.parse(JSON.stringify(sum));
                                  tempobj.transmutedGrade55 =
                                    sum.transmutedGrade55 + val.transmutedGrade55;
                                  return tempobj;
                                }).transmutedGrade55,
                              ) / this.state.data.length
                            : 'Not yet available'}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Transmutated Grade (60%)">
                          {this.state.data.length != 0 &&
                          parseFloat(
                            this.state.data.reduce((sum, val) => {
                              const tempobj = JSON.parse(JSON.stringify(sum));
                              tempobj.transmutedGrade60 =
                                sum.transmutedGrade60 + val.transmutedGrade60;
                              return tempobj;
                            }).transmutedGrade60,
                          ) /
                            this.state.data.length !=
                            -1
                            ? parseFloat(
                                this.state.data.reduce((sum, val) => {
                                  const tempobj = JSON.parse(JSON.stringify(sum));
                                  tempobj.transmutedGrade60 =
                                    sum.transmutedGrade60 + val.transmutedGrade60;
                                  return tempobj;
                                }).transmutedGrade60,
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
                <Table responsive={true} highlightRowOnHover={true}>
                  <Table.Header>
                    <Table.ColHeader colSpan={2}>Student Name</Table.ColHeader>
                    {/* <Table.ColHeader alignContent="center">Formative Assessment</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Written Works</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Performance Tasks</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Quarterly Assessment</Table.ColHeader> */}
                    <Table.ColHeader alignContent="center">Actual Grade</Table.ColHeader>
                    <Table.ColHeader alignContent="center">
                      Transmuted Grade (50%) <Tag color="yellow">Yellow</Tag>
                    </Table.ColHeader>
                    <Table.ColHeader alignContent="center">
                      Transmuted Grade (55%) <Tag color="orange">Orange</Tag>
                    </Table.ColHeader>
                    <Table.ColHeader alignContent="center">
                      Transmuted Grade (60%) <Tag color="green">Green</Tag>
                    </Table.ColHeader>
                    <Table.ColHeader alignContent="center">Final Grade</Table.ColHeader>
                  </Table.Header>
                  <Table.Body>{displayData}</Table.Body>
                </Table>
              </Grid.Col>
            </Grid.Row>
          </Card.Body>
          <Card.Footer>
            <Button.List align="right">
              <ViewEditLog
                classRecordID={this.state.classRecordID}
                quarter={this.state.quarter}
                position="Teacher"
              />
            </Button.List>
          </Card.Footer>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeacherSummaryPerQuarter);
