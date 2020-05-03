import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import axios from 'axios';
import { Pagination, Spin, Tooltip } from 'antd';
import { Modal, Popconfirm, Search, Breadcrumb, AutoComplete, Input, message } from 'antd';
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
import ViewEditLog from './ViewEditLog';
const { Option } = AutoComplete;

export class RegistrarManageGrades extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      sectionName: '',
      subjectCode: '',
      subjectName: '',
      schoolYear: '',
      classRecordID: 0,
      faData: [],
      wwData: [],
      ptData: [],
      qeData: [],
      showAddNewSubcomponent: false,
      selectedCompID: -1,
      selectedSubcompID: -1,
      keyword: '',
      showConfirmDelete: false,
      deleteText: '',
      editFA: false,
      editWW: false,
      editPT: false,
      faLoading: false,
      ptLoading: false,
      wwLoading: false,
      hasErrors: true,
      quarter: 'Q1',
      currentUpdated: '',
      subjectType: '',
      locked: false,
      status: '',
    };
    this.showAddNewSubcomponent = this.showAddNewSubcomponent.bind(this);
    this.hideAddNewSubcomponent = this.hideAddNewSubcomponent.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addNewSubcomponent = this.addNewSubcomponent.bind(this);
    this.deleteSubcomponent = this.deleteSubcomponent.bind(this);
    this.onReset = this.onReset.bind(this);
    this.editSubcomponent = this.editSubcomponent.bind(this);
  }

  editSubcomponent(payload) {
    this.props.actions.editSubcomponent(
      {
        payload,
        classRecordID: this.props.classRecordID,
        quarter:
          this.state.subjectType == 'NON_SHS' || this.state.subjectType == '1ST_SEM'
            ? this.props.quarter
            : this.props.quarter == 'Q3'
            ? 'Q1'
            : 'Q2',
      },
      'Registrar',
    );
  }

  deleteSubcomponent() {
    if (this.state.deleteText != 'DELETE') {
      message.error('You must type DELETE to confirm');
    } else {
      this.props.actions.deleteSubcomponent(
        {
          subcompID: this.state.selectedSubcompID,
          classRecordID: this.props.classRecordID,
          quarter:
            this.state.subjectType == 'NON_SHS' || this.state.subjectType == '1ST_SEM'
              ? this.props.quarter
              : this.props.quarter == 'Q3'
              ? 'Q1'
              : 'Q2',
        },
        'Registrar',
      );
      this.setState({ showConfirmDelete: false });
    }
  }

  addNewSubcomponent() {
    this.props.actions.addNewSubcomponent(
      {
        classRecordID: this.props.classRecordID,
        name: this.state.keyword,
        componentID: this.state.selectedCompID,
        quarter:
          this.state.subjectType == 'NON_SHS' || this.state.subjectType == '1ST_SEM'
            ? this.props.quarter
            : this.props.quarter == 'Q3'
            ? 'Q1'
            : 'Q2',
      },
      'Registrar',
    );
    this.setState({ showAddNewSubcomponent: false });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  showAddNewSubcomponent(key) {
    this.setState({ showAddNewSubcomponent: true, selectedCompID: key, keyword: '' });
  }

  hideAddNewSubcomponent() {
    this.setState({ showAddNewSubcomponent: false, selectedCompID: -1 });
  }

  onReset(key) {
    switch (key) {
      case 'FA': {
        this.setState({ faLoading: true });
        axios
          .post('api/registrar/getcomponents', {
            classRecordID: this.props.classRecordID,
            quarter:
              this.state.subjectType == 'NON_SHS' || this.state.subjectType == '1ST_SEM'
                ? this.props.quarter
                : this.props.quarter == 'Q3'
                ? 'Q1'
                : 'Q2',
          })
          .then(res => {
            this.setState({
              sectionName: res.data.sectionName,
              subjectName: res.data.subjectName,
              schoolYear: res.data.schoolYear,
              subjectCode: res.data.subjectCode,
              classRecordID: res.data.classRecordID,
              faData: res.data.FA,
              wwData: res.data.WW,
              ptData: res.data.PT,
              qeData: res.data.QE,
              faLoading: false,
            });
          });
      }
      case 'WW': {
        this.setState({ wwLoading: true });
        axios
          .post('api/registrar/getcomponents', {
            classRecordID: this.props.classRecordID,
            quarter:
              this.state.subjectType == 'NON_SHS' || this.state.subjectType == '1ST_SEM'
                ? this.props.quarter
                : this.props.quarter == 'Q3'
                ? 'Q1'
                : 'Q2',
          })
          .then(res => {
            this.setState({
              sectionName: res.data.sectionName,
              subjectName: res.data.subjectName,
              schoolYear: res.data.schoolYear,
              subjectCode: res.data.subjectCode,
              classRecordID: res.data.classRecordID,
              faData: res.data.FA,
              wwData: res.data.WW,
              ptData: res.data.PT,
              qeData: res.data.QE,
              wwLoading: false,
            });
          });
      }
      case 'PT': {
        this.setState({ ptLoading: true });
        axios
          .post('api/registrar/getcomponents', {
            classRecordID: this.props.classRecordID,
            quarter:
              this.state.subjectType == 'NON_SHS' || this.state.subjectType == '1ST_SEM'
                ? this.props.quarter
                : this.props.quarter == 'Q3'
                ? 'Q1'
                : 'Q2',
          })
          .then(res => {
            this.setState({
              sectionName: res.data.sectionName,
              subjectName: res.data.subjectName,
              schoolYear: res.data.schoolYear,
              subjectCode: res.data.subjectCode,
              classRecordID: res.data.classRecordID,
              faData: res.data.FA,
              wwData: res.data.WW,
              ptData: res.data.PT,
              qeData: res.data.QE,
              ptLoading: false,
            });
          });
      }
      default: {
      }
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .post('api/registrar/getsubjecttype', { classRecordID: this.props.classRecordID })
      .then(res => {
        this.setState({ subjectType: res.data.subjectType }, () => {
          axios
            .post('api/registrar/getcomponents', {
              classRecordID: this.props.classRecordID,
              quarter:
                this.state.subjectType == 'NON_SHS' || this.state.subjectType == '1ST_SEM'
                  ? this.props.quarter
                  : this.props.quarter == 'Q3'
                  ? 'Q1'
                  : 'Q2',
            })
            .then(res2 => {
              this.setState({
                sectionName: res2.data.sectionName,
                subjectName: res2.data.subjectName,
                schoolYear: res2.data.schoolYear,
                subjectCode: res2.data.subjectCode,
                classRecordID: res2.data.classRecordID,
                faData: res2.data.FA,
                wwData: res2.data.WW,
                ptData: res2.data.PT,
                qeData: res2.data.QE,
                quarter: this.props.quarter,
                isLoading: false,
              });
            });
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.app.showLoading && Object.keys(nextProps.app.errors).length == 0) {
      this.setState({ isLoading: true });
      axios
        .post('api/registrar/getsubjecttype', { classRecordID: this.props.classRecordID })
        .then(res => {
          this.setState({ subjectType: res.data.subjectType }, () => {
            axios
              .post('api/registrar/getcomponents', {
                classRecordID: this.props.classRecordID,
                quarter:
                  this.state.subjectType == 'NON_SHS' || this.state.subjectType == '1ST_SEM'
                    ? this.props.quarter
                    : this.props.quarter == 'Q3'
                    ? 'Q1'
                    : 'Q2',
              })
              .then(res2 => {
                this.setState({
                  sectionName: res2.data.sectionName,
                  subjectName: res2.data.subjectName,
                  schoolYear: res2.data.schoolYear,
                  subjectCode: res2.data.subjectCode,
                  classRecordID: res2.data.classRecordID,
                  faData: res2.data.FA,
                  wwData: res2.data.WW,
                  ptData: res2.data.PT,
                  qeData: res2.data.QE,
                  quarter: this.props.quarter,
                  isLoading: false,
                });
              });
          });
        });
    }
  }

  render() {
    const { locked } = this.state;
    let displayFaData = [];
    let displayWwData = [];
    let displayPtData = [];
    let displayQeData = [];
    if (!this.state.isLoading) {
      if (this.state.editFA) {
        for (const [index, value] of this.state.faData.subcomponents.entries()) {
          displayFaData.push(
            <Table.Row>
              <Table.Col>
                <Form.Input
                  value={value.name}
                  onChange={e => {
                    let temparr = this.state.faData;
                    temparr.subcomponents[index].name = e.target.value;
                    this.setState({ faData: temparr });
                  }}
                />
              </Table.Col>
              <Table.Col>
                <Form.Input
                  value={value.compWeight}
                  onChange={e => {
                    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
                    if (
                      (!isNaN(e.target.value) && reg.test(e.target.value)) ||
                      e.target.value === '' ||
                      e.target.value === '-'
                    ) {
                      let temparr = this.state.faData;
                      temparr.subcomponents[index].compWeight = e.target.value;
                      this.setState({ faData: temparr });
                    }
                  }}
                />
              </Table.Col>
              <Table.Col alignContent="center"></Table.Col>
            </Table.Row>,
          );
        }
      } else {
        for (const [index, value] of this.state.faData.subcomponents.entries()) {
          displayFaData.push(
            <Table.Row>
              <Table.Col>{value.name}</Table.Col>
              <Table.Col>{value.compWeight}%</Table.Col>
              <Table.Col alignContent="center">
                {!locked && (
                  <span>
                    <Button
                      icon="trash"
                      color="danger"
                      onClick={() =>
                        this.setState({
                          selectedSubcompID: value.subcompID,
                          showConfirmDelete: true,
                          deleteText: '',
                        })
                      }
                      pill
                      size="sm"
                    ></Button>
                  </span>
                )}
              </Table.Col>
            </Table.Row>,
          );
        }
      }
      if (this.state.editWW) {
        for (const [index, value] of this.state.wwData.subcomponents.entries()) {
          displayWwData.push(
            <Table.Row>
              <Table.Col>
                <Form.Input
                  value={value.name}
                  onChange={e => {
                    let temparr = this.state.wwData;
                    temparr.subcomponents[index].name = e.target.value;
                    this.setState({ wwData: temparr });
                  }}
                />
              </Table.Col>
              <Table.Col>
                <Form.Input
                  value={value.compWeight}
                  onChange={e => {
                    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
                    if (
                      (!isNaN(e.target.value) && reg.test(e.target.value)) ||
                      e.target.value === '' ||
                      e.target.value === '-'
                    ) {
                      let temparr = this.state.wwData;
                      temparr.subcomponents[index].compWeight = e.target.value;
                      this.setState({ wwData: temparr });
                    }
                  }}
                />
              </Table.Col>
              <Table.Col alignContent="center"></Table.Col>
            </Table.Row>,
          );
        }
      } else {
        for (const [index, value] of this.state.wwData.subcomponents.entries()) {
          displayWwData.push(
            <Table.Row>
              <Table.Col>{value.name}</Table.Col>
              <Table.Col>{value.compWeight}%</Table.Col>
              <Table.Col alignContent="center">
                {!locked && (
                  <span>
                    <Button
                      icon="trash"
                      color="danger"
                      onClick={() =>
                        this.setState({
                          selectedSubcompID: value.subcompID,
                          showConfirmDelete: true,
                          deleteText: '',
                        })
                      }
                      pill
                      size="sm"
                    ></Button>
                  </span>
                )}
              </Table.Col>
            </Table.Row>,
          );
        }
      }
      if (this.state.editPT) {
        for (const [index, value] of this.state.ptData.subcomponents.entries()) {
          displayPtData.push(
            <Table.Row>
              <Table.Col>
                <Form.Input
                  value={value.name}
                  onChange={e => {
                    let temparr = this.state.ptData;
                    temparr.subcomponents[index].name = e.target.value;
                    this.setState({ ptData: temparr });
                  }}
                />
              </Table.Col>
              <Table.Col>
                <Form.Input
                  value={value.compWeight}
                  onChange={e => {
                    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
                    if (
                      (!isNaN(e.target.value) && reg.test(e.target.value)) ||
                      e.target.value === '' ||
                      e.target.value === '-'
                    ) {
                      let temparr = this.state.ptData;
                      temparr.subcomponents[index].compWeight = e.target.value;
                      this.setState({ ptData: temparr });
                    }
                  }}
                />
              </Table.Col>
              <Table.Col alignContent="center"></Table.Col>
            </Table.Row>,
          );
        }
      } else {
        for (const [index, value] of this.state.ptData.subcomponents.entries()) {
          displayPtData.push(
            <Table.Row>
              <Table.Col>{value.name}</Table.Col>
              <Table.Col>{value.compWeight}%</Table.Col>
              <Table.Col alignContent="center">
                {!locked && (
                  <span>
                    <Button
                      icon="trash"
                      color="danger"
                      onClick={() =>
                        this.setState({
                          selectedSubcompID: value.subcompID,
                          showConfirmDelete: true,
                          deleteText: '',
                        })
                      }
                      pill
                      size="sm"
                    ></Button>
                  </span>
                )}
              </Table.Col>
            </Table.Row>,
          );
        }
      }

      for (const [index, value] of this.state.qeData.subcomponents.entries()) {
        displayQeData.push(
          <Table.Row>
            <Table.Col>{value.name}</Table.Col>
            <Table.Col>{value.compWeight}%</Table.Col>
          </Table.Row>,
        );
      }
    }
    if (displayFaData.length == 0) {
      displayFaData.push(
        <Table.Row>
          <Table.Col colSpan={2} alignContent="center">
            No subcomponents.
          </Table.Col>
        </Table.Row>,
      );
    }
    if (displayWwData.length == 0) {
      displayWwData.push(
        <Table.Row>
          <Table.Col colSpan={2} alignContent="center">
            No subcomponents.
          </Table.Col>
        </Table.Row>,
      );
    }
    if (displayPtData.length == 0) {
      displayPtData.push(
        <Table.Row>
          <Table.Col colSpan={2} alignContent="center">
            No subcomponents.
          </Table.Col>
        </Table.Row>,
      );
    }
    if (displayQeData.length == 0) {
      displayQeData.push(
        <Table.Row>
          <Table.Col colSpan={2} alignContent="center">
            No subcomponents.
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-teacher-manage-grades my-3 my-md-5">
        <Container>
          <Modal
            title="Delete Subcomponent"
            visible={this.state.showConfirmDelete}
            onOk={this.deleteSubcomponent}
            onCancel={() => this.setState({ showConfirmDelete: false })}
            okText="Delete"
            confirmLoading={this.props.app.showLoading}
            cancelText="Cancel"
          >
            <Container>
              <Grid.Row>
                <Grid.Col sm={12} xs={12} md={12} lg={12}>
                  <Header.H5>
                    Are you sure you want to delete this subcomponent? Deleting this will delete ALL
                    STUDENT RECORDS under that subcomponent. Type 'DELETE' to confirm.
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
          <Modal
            title="Add New Subcomponent"
            visible={this.state.showAddNewSubcomponent}
            onOk={this.addNewSubcomponent}
            onCancel={this.hideAddNewSubcomponent}
            okText="Add"
            confirmLoading={this.props.app.showLoading}
            cancelText="Close"
          >
            <Grid.Row>
              <Grid.Col sm={12} md={12} xs={12}>
                <Form.Group>
                  <Form.Label>Subcomponent Name</Form.Label>
                  <Form.Input
                    placeholder="Subcomponent name"
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.onChange}
                  />
                </Form.Group>
              </Grid.Col>
            </Grid.Row>
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
                      </Breadcrumb>
                    </Card.Title>
                    <Grid.Row></Grid.Row>
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
                        <Grid.Col xs={12} sm={12} md={3}></Grid.Col>
                        <Grid.Col xs={12} sm={12} md={3}></Grid.Col>
                        <Grid.Col xs={12} sm={12} md={6}>
                          <Button.List align="right">
                            <Link
                              to={`/summaryreport/${this.props.subsectID}/${this.state.quarter}`}
                            >
                              <Button color="success" icon="file">
                                View{' '}
                                {this.state.subjectType == 'NON_SHS'
                                  ? this.props.quarter
                                  : this.props.quarter == 'Q1' || this.props.quarter == 'Q3'
                                  ? 'MIDTERM'
                                  : 'FINALS'}{' '}
                                Summary Report
                              </Button>
                            </Link>
                          </Button.List>
                        </Grid.Col>
                      </Grid.Row>
                    </Card.Title>
                  </div>
                )}
              </Card.Body>
              {this.state.isLoading ? (
                <Spin spinning={this.state.isLoading}></Spin>
              ) : (
                <Card.Body>
                  <Grid.Row>
                    {Object.keys(this.props.app.errors).length != 0 && (
                      <Alert type="danger" icon="alert-triangle">
                        There is an error updating the subcomponents. Make sure that no field is
                        empty and weights are between 0 to 100. Subcomponent names must be between 2
                        to 255 characters.
                      </Alert>
                    )}
                  </Grid.Row>

                  <Spin spinning={this.state.isLoading}>
                    <Grid.Row>
                      <Grid.Col sm={12} xs={12} md={6}>
                        <Spin spinning={this.state.faLoading}>
                          <Card statusColor={this.state.editFA ? 'yellow' : 'blue'}>
                            <Card.Header>
                              <Card.Title>
                                Formative Assessment - {this.state.faData.weight}%
                              </Card.Title>
                              <Card.Options>
                                {this.state.editFA ? (
                                  ''
                                ) : (
                                  <Button.List>
                                    <Button color="info" size="sm">
                                      <Link
                                        style={{ color: 'white' }}
                                        to={`/individualdeliberation/${this.props.id}/managegrade/${
                                          this.props.classRecordID
                                        }/quarter/${
                                          this.state.subjectType == 'NON_SHS' ||
                                          this.state.subjectType == '1ST_SEM'
                                            ? this.props.quarter
                                            : this.props.quarter == 'Q3'
                                            ? 'Q1'
                                            : 'Q2'
                                        }/comp/${this.state.faData.componentID}`}
                                      >
                                        View
                                      </Link>
                                    </Button>
                                    {!locked && (
                                      <Button
                                        color="primary"
                                        size="sm"
                                        onClick={() => {
                                          this.setState({
                                            editFA: true,
                                          });
                                        }}
                                      >
                                        Edit
                                      </Button>
                                    )}
                                  </Button.List>
                                )}
                              </Card.Options>
                            </Card.Header>
                            <Card.Body>
                              <Table responsive={true}>
                                <Table.Header>
                                  <Table.ColHeader>Subcomponent Name</Table.ColHeader>
                                  <Table.ColHeader>Weight</Table.ColHeader>
                                  <Table.ColHeader>Actions</Table.ColHeader>
                                </Table.Header>
                                <Table.Body>{displayFaData}</Table.Body>
                              </Table>
                            </Card.Body>
                            {!locked && (
                              <Card.Footer>
                                {this.state.editFA ? (
                                  <Button.List align="right">
                                    <Button
                                      color="info"
                                      size="sm"
                                      onClick={() => {
                                        this.setState({ editFA: false });
                                        this.onReset('FA');
                                      }}
                                    >
                                      Back
                                    </Button>
                                    <Button
                                      color="primary"
                                      size="sm"
                                      onClick={() => {
                                        this.setState({ currentUpdated: 'FA' }, () => {
                                          this.editSubcomponent(this.state.faData.subcomponents);
                                        });
                                      }}
                                    >
                                      Save
                                    </Button>
                                  </Button.List>
                                ) : (
                                  <Button.List align="right">
                                    <Button
                                      color="primary"
                                      size="sm"
                                      icon="plus"
                                      onClick={() =>
                                        this.showAddNewSubcomponent(this.state.faData.componentID)
                                      }
                                    >
                                      Add New Subcomponent
                                    </Button>
                                  </Button.List>
                                )}
                              </Card.Footer>
                            )}
                          </Card>
                        </Spin>
                      </Grid.Col>
                      <Grid.Col sm={12} xs={12} md={6}>
                        <Spin spinning={this.state.wwLoading}>
                          <Card statusColor={this.state.editWW ? 'yellow' : 'blue'}>
                            <Card.Header>
                              <Card.Title>Written Works - {this.state.wwData.weight}%</Card.Title>
                              <Card.Options>
                                {this.state.editWW ? (
                                  ''
                                ) : (
                                  <Button.List>
                                    <Button color="info" size="sm">
                                      <Link
                                        style={{ color: 'white' }}
                                        to={`/individualdeliberation/${this.props.id}/managegrade/${
                                          this.props.classRecordID
                                        }/quarter/${
                                          this.state.subjectType == 'NON_SHS' ||
                                          this.state.subjectType == '1ST_SEM'
                                            ? this.props.quarter
                                            : this.props.quarter == 'Q3'
                                            ? 'Q1'
                                            : 'Q2'
                                        }/comp/${this.state.wwData.componentID}`}
                                      >
                                        View
                                      </Link>
                                    </Button>
                                    {!locked && (
                                      <Button
                                        color="primary"
                                        size="sm"
                                        onClick={() => {
                                          this.setState({
                                            editWW: true,
                                          });
                                        }}
                                      >
                                        Edit
                                      </Button>
                                    )}
                                  </Button.List>
                                )}
                              </Card.Options>
                            </Card.Header>
                            <Card.Body>
                              <Table responsive={true}>
                                <Table.Header>
                                  <Table.ColHeader>Subcomponent Name</Table.ColHeader>
                                  <Table.ColHeader>Weight</Table.ColHeader>
                                  <Table.ColHeader>Actions</Table.ColHeader>
                                </Table.Header>
                                <Table.Body>{displayWwData}</Table.Body>
                              </Table>
                            </Card.Body>
                            {!locked && (
                              <Card.Footer>
                                {this.state.editWW ? (
                                  <Button.List align="right">
                                    <Button
                                      color="info"
                                      size="sm"
                                      onClick={() => {
                                        this.setState({ editWW: false });
                                        this.onReset('WW');
                                      }}
                                    >
                                      Back
                                    </Button>
                                    <Button
                                      color="primary"
                                      size="sm"
                                      onClick={() => {
                                        this.setState({ currentUpdated: 'WW' }, () => {
                                          this.editSubcomponent(this.state.wwData.subcomponents);
                                        });
                                      }}
                                    >
                                      Save
                                    </Button>
                                  </Button.List>
                                ) : (
                                  <Button.List align="right">
                                    <Button
                                      color="primary"
                                      size="sm"
                                      icon="plus"
                                      onClick={() =>
                                        this.showAddNewSubcomponent(this.state.wwData.componentID)
                                      }
                                    >
                                      Add New Subcomponent
                                    </Button>
                                  </Button.List>
                                )}
                              </Card.Footer>
                            )}
                          </Card>
                        </Spin>
                      </Grid.Col>
                      <Grid.Col sm={12} xs={12} md={6}>
                        <Spin spinning={this.state.ptLoading}>
                          <Card statusColor={this.state.editPT ? 'yellow' : 'blue'}>
                            <Card.Header>
                              <Card.Title>
                                Performance Task - {this.state.ptData.weight}%
                              </Card.Title>
                              <Card.Options>
                                {this.state.editPT ? (
                                  ''
                                ) : (
                                  <Button.List>
                                    <Button color="info" size="sm">
                                      <Link
                                        style={{ color: 'white' }}
                                        to={`/individualdeliberation/${this.props.id}/managegrade/${
                                          this.props.classRecordID
                                        }/quarter/${
                                          this.state.subjectType == 'NON_SHS' ||
                                          this.state.subjectType == '1ST_SEM'
                                            ? this.props.quarter
                                            : this.props.quarter == 'Q3'
                                            ? 'Q1'
                                            : 'Q2'
                                        }/comp/${this.state.ptData.componentID}`}
                                      >
                                        View
                                      </Link>
                                    </Button>
                                    {!locked && (
                                      <Button
                                        color="primary"
                                        size="sm"
                                        onClick={() => {
                                          this.setState({
                                            editPT: true,
                                          });
                                        }}
                                      >
                                        Edit
                                      </Button>
                                    )}
                                  </Button.List>
                                )}
                              </Card.Options>
                            </Card.Header>
                            <Card.Body>
                              <Table responsive={true}>
                                <Table.Header>
                                  <Table.ColHeader>Subcomponent Name</Table.ColHeader>
                                  <Table.ColHeader>Weight</Table.ColHeader>
                                  <Table.ColHeader>Actions</Table.ColHeader>
                                </Table.Header>
                                <Table.Body>{displayPtData}</Table.Body>
                              </Table>
                            </Card.Body>
                            {!locked && (
                              <Card.Footer>
                                {this.state.editPT ? (
                                  <Button.List align="right">
                                    <Button
                                      color="info"
                                      size="sm"
                                      onClick={() => {
                                        this.setState({ editPT: false });
                                        this.onReset('PT');
                                      }}
                                    >
                                      Back
                                    </Button>
                                    <Button
                                      color="primary"
                                      size="sm"
                                      onClick={() => {
                                        this.setState({ currentUpdated: 'PT' }, () => {
                                          this.editSubcomponent(this.state.ptData.subcomponents);
                                        });
                                      }}
                                    >
                                      Save
                                    </Button>
                                  </Button.List>
                                ) : (
                                  <Button.List align="right">
                                    <Button
                                      color="primary"
                                      size="sm"
                                      icon="plus"
                                      onClick={() =>
                                        this.showAddNewSubcomponent(this.state.ptData.componentID)
                                      }
                                    >
                                      Add New Subcomponent
                                    </Button>
                                  </Button.List>
                                )}
                              </Card.Footer>
                            )}
                          </Card>
                        </Spin>
                      </Grid.Col>
                      <Grid.Col sm={12} xs={12} md={6}>
                        <Card statusColor="blue">
                          <Card.Header>
                            <Card.Title>
                              Quarterly Assessment - {this.state.qeData.weight}%
                            </Card.Title>
                            <Card.Options>
                              <Button.List>
                                <Button color="info" size="sm">
                                  <Link
                                    style={{ color: 'white' }}
                                    to={`/individualdeliberation/${this.props.id}/managegrade/${
                                      this.props.classRecordID
                                    }/quarter/${
                                      this.state.subjectType == 'NON_SHS' ||
                                      this.state.subjectType == '1ST_SEM'
                                        ? this.props.quarter
                                        : this.props.quarter == 'Q3'
                                        ? 'Q1'
                                        : 'Q2'
                                    }/comp/${this.state.qeData.componentID}`}
                                  >
                                    View
                                  </Link>
                                </Button>
                              </Button.List>
                            </Card.Options>
                          </Card.Header>
                          <Card.Body>
                            <Table responsive={true}>
                              <Table.Header>
                                <Table.ColHeader>Subcomponent Name</Table.ColHeader>
                                <Table.ColHeader>Weight</Table.ColHeader>
                              </Table.Header>
                              <Table.Body>{displayQeData}</Table.Body>
                            </Table>
                          </Card.Body>
                        </Card>
                      </Grid.Col>
                    </Grid.Row>
                  </Spin>
                </Card.Body>
              )}
              <Card.Footer>
                <Button.List align="right">
                  <ViewEditLog
                    classRecordID={this.props.classRecordID}
                    quarter={
                      this.state.subjectType == 'NON_SHS' || this.state.subjectType == '1ST_SEM'
                        ? this.props.quarter
                        : this.props.quarter == 'Q3'
                        ? 'Q1'
                        : 'Q2'
                    }
                    position="Registrar"
                  />
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarManageGrades);
