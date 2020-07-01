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
import { getImageUrl, getPlaceholder } from '../../utils';
import ViewEditLog from './ViewEditLog';
const { Option } = AutoComplete;

export class RegistrarSubcomponent extends Component {
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
      data: [],
      ave: [],
      isLoading: true,
      quarter: 'Q1',
      sectionName: '',
      subjectName: '',
      schoolYear: '',
      subjectCode: '',
      showConfirmDelete: false,
      selectedDateGiven: new Date(),
      selectedDescription: '',
      deleteText: '',
      subsectID: 0,
      locked: false,
    };

    this.deleteRecord = this.deleteRecord.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  deleteRecord() {
    if (this.state.deleteText != 'DELETE') {
      message.error('You must type DELETE to confirm');
    } else {
      this.props.actions.deleteRecord(
        {
          classRecordID: this.props.classRecordID,
          description: this.state.selectedDescription,
          dateGiven: this.state.selectedDateGiven,
          subcompID: this.state.subcompID,
          componentID: this.state.componentID,
          quarter: this.state.quarter,
        },
        'Registrar',
      );
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .post('api/registrar/getcomponents', {
        classRecordID: this.props.classRecordID,
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
          .post('api/registrar/subcompinfo', {
            classRecordID: this.props.classRecordID,
            componentID: this.props.componentID,
            quarter: this.props.quarter,
            subcompID: this.props.subcompID,
          })
          .then(res2 => {
            this.setState({
              isLoading: false,
              componentID: this.props.componentID,
              component: res2.data.component,
              subcompName: res2.data.subcompName,
              subcompID: this.props.subcompID,
              data: res2.data.data,
              ave: res2.data.ave,
              quarter: this.props.quarter,
            });
          });
      });
  }

  componentWillReceiveProps() {
    this.setState({ isLoading: true, showConfirmDelete: false });
    axios
      .post('api/registrar/getcomponents', {
        classRecordID: this.props.classRecordID,
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
          .post('api/registrar/subcompinfo', {
            classRecordID: this.props.classRecordID,
            componentID: this.props.componentID,
            quarter: this.props.quarter,
            subcompID: this.props.subcompID,
          })
          .then(res2 => {
            this.setState({
              isLoading: false,
              componentID: this.props.componentID,
              component: res2.data.component,
              subcompName: res2.data.subcompName,
              subcompID: this.props.subcompID,
              data: res2.data.data,
              ave: res2.data.ave,
              quarter: this.props.quarter,
            });
          });
      });
  }

  render() {
    const { locked } = this.props;
    let headerData = [];
    let tableData = [];
    headerData.push(<Table.ColHeader colSpan={2}>Student Name</Table.ColHeader>);
    if (!this.state.isLoading) {
      for (const [index, value] of this.state.data[0].grades.entries()) {
        headerData.push(
          <Table.ColHeader alignContent="center">
            <Popover
              content={
                <div>
                  <p>
                    <b>Description:</b> {value.description}
                  </p>
                  <p>
                    <b>Number of items:</b> {value.total}
                  </p>
                </div>
              }
            >
              Item #{index + 1}
            </Popover>
            {!locked && (
              <span style={{ marginLeft: '15px' }}>
                <Button.List>
                  <Button
                    icon="edit"
                    size="sm"
                    outline
                    color="primary"
                    onClick={() => {
                      this.props.history.push(
                        `/individualdeliberation/${this.props.id}/managegrade/${this.props.classRecordID}/quarter/${this.props.quarter}/comp/${this.props.componentID}/subcomp/${this.props.subcompID}/editrecord/${value.gradeID}`,
                      );
                    }}
                  ></Button>
                  <Button
                    icon="trash"
                    size="sm"
                    color="danger"
                    onClick={() => {
                      this.setState({
                        deleteText: '',
                        showConfirmDelete: true,
                        selectedDescription: value.description,
                        selectedDateGiven: value.dateGiven,
                      });
                    }}
                    outline
                  ></Button>
                </Button.List>
              </span>
            )}
          </Table.ColHeader>,
        );
      }
      headerData.push(<Table.ColHeader alignContent="center">Percentage Score</Table.ColHeader>);
      for (const [index, value] of this.state.data.entries()) {
        let name = value.name;
        let imageUrl = value.imageUrl;
        let ps = value.ps;
        let tempRow = [];
        for (const [index2, value2] of value.grades.entries()) {
          tempRow.push(
            <Table.Col alignContent="center">
              <Popover
                content={
                  <div>
                    <p>
                      <b>Description:</b> {value2.description}
                    </p>
                    <p>
                      <b>Number of items:</b> {value2.total}
                    </p>
                  </div>
                }
              >
                {value2.attendance == 'A'
                  ? 'Absent'
                  : value2.attendance == 'E'
                  ? 'Excused'
                  : `${value2.score}/${value2.total}`}
              </Popover>
            </Table.Col>,
          );
        }
        tempRow.push(
          <Table.Col alignContent="center">
            {ps == -1 ? 'Not yet available' : Number(Math.round(ps + 'e2') + 'e-2')}
          </Table.Col>,
        );
        tableData.push(
          <Table.Row>
            <Table.Col className="w-1">
              <Avatar imageURL={imageUrl == 'NA' ? getPlaceholder() : getImageUrl(imageUrl)} />
            </Table.Col>
            <Table.Col>{name}</Table.Col>
            {tempRow}
          </Table.Row>,
        );
      }
    }
    return (
      <div className="app-teacher-subcomponent my-3 my-md-5">
        <Container>
          <Modal
            title="Delete Record"
            visible={this.state.showConfirmDelete}
            onOk={this.deleteRecord}
            onCancel={() =>
              this.setState({
                showConfirmDelete: false,
                selectedDateGiven: 0,
                selectedDescription: '',
              })
            }
            okText="Delete"
            confirmLoading={this.props.app.showLoading}
            cancelText="Cancel"
          >
            <Container>
              <Grid.Row>
                <Grid.Col sm={12} xs={12} md={12} lg={12}>
                  <Header.H5>
                    Are you sure you want to delete this record Deleting this will delete ALL
                    STUDENT RECORDS. Type 'DELETE' to confirm.
                  </Header.H5>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col sm={12} xs={12} md={12} lg={12}>
                  <Form.Group>
                    <Form.Input
                      autoComplete="off"
                      value={this.state.deleteText}
                      name="deleteText"
                      onChange={this.onChange}
                      placeholder="Type DELETE"
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
            </Container>
          </Modal>
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
                    <Grid.Row>
                      <Grid.Col sm={12} xs={12} md={8}>
                        <Card.Title>
                          <Header.H3>
                            {this.state.component} - {this.state.subcompName}
                          </Header.H3>
                        </Card.Title>
                        <Card.Title>
                          <Text.Small>
                            {this.state.sectionName} {this.props.quarter} S.Y.{' '}
                            {this.state.schoolYear}
                          </Text.Small>
                        </Card.Title>
                      </Grid.Col>
                      <Grid.Col sm={12} xs={12} md={4}>
                        <Link
                          to={`/individualdeliberation/${this.props.id}/managegrade/${this.props.classRecordID}/quarter/${this.props.quarter}/comp/${this.props.componentID}/subcomp/${this.props.subcompID}/addrecord`}
                        >
                          {!locked && (
                            <Button.List align="right">
                              <Button style={{ margin: '20px' }} icon="plus" color="primary">
                                Add New Record
                              </Button>
                            </Button.List>
                          )}
                        </Link>
                      </Grid.Col>
                    </Grid.Row>
                  </div>
                )}
              </Card.Body>
              {this.state.isLoading ? (
                <Spin spinning={true}></Spin>
              ) : (
                <Card.Body>
                  <Grid.Row>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Descriptions
                        style={{ marginBottom: '15px', marginTop: '15px' }}
                        bordered
                        title="Subject Load Information"
                      >
                        <Descriptions.Item span={3} label="Section Name">
                          {this.state.sectionName}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Subject Name">
                          {this.state.subjectName}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Number of Students">
                          {tableData.length}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Number of items">
                          {this.state.data[0].grades.length}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Total Number of items">
                          {this.state.data[0].grades != 0
                            ? this.state.data[0].grades.reduce((sum, val) => {
                                let tempArr = JSON.parse(JSON.stringify(sum));
                                tempArr.total = sum.total + val.total;
                                return tempArr;
                              }).total
                            : 0}
                        </Descriptions.Item>
                      </Descriptions>
                    </Grid.Col>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Table highlightRowOnHover={true} responsive={true}>
                        <Table.Header>{headerData}</Table.Header>
                        <Table.Body>{tableData}</Table.Body>
                      </Table>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Body>
              )}
              <Card.Footer>
                <Button.List align="right">
                  {(this.props.app.auth.user.position == 2 ||
                    this.props.app.auth.user.position == 3) && (
                    <ViewEditLog
                      classRecordID={this.props.classRecordID}
                      quarter={this.state.quarter}
                      position="Registrar"
                    />
                  )}
                </Button.List>
              </Card.Footer>
            </Card>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrarSubcomponent);
