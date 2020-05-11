import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import axios from 'axios';
import { Spin, Breadcrumb, Pagination } from 'antd';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import placeholder from '../../images/placeholder.jpg';
import { getImageUrl, getPlaceholder } from '../../utils';

export class RegistrarViewPastRecords extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingTable: true,
      schoolYearID: 0,
      sectionName: '',
      schoolYear: '',
      gradeLevel: '',
      pastGradeLevel: '',
      data: [],
      keyword: '',
      page: 1,
      pageSize: 10,
      numOfPages: 1,
      selectedKey: 0,
    };

    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.enrollStudent = this.enrollStudent.bind(this);
  }

  enrollStudent(studentID) {
    axios.get('api/registrar/getsy').then(res => {
      this.props.actions.createStudentSection({
        sectionID: this.props.id,
        schoolYearID: res.data.schoolYearID,
        studentID,
      });
    });
  }

  onChangeSearch(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ page: 1 });
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/getpastrecords', {
        page: 1,
        pageSize: this.state.pageSize,
        keyword: event.target.value,
        gradeLevel: this.state.gradeLevel,
      })
      .then(res => {
        this.setState({ numOfPages: res.data.numOfPages });
        this.setState({ data: res.data.studentData });
        this.setState({ isLoadingTable: false });
      });
  }

  paginate = page => {
    this.setState({ page });
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/getpastrecords', {
        page,
        pageSize: this.state.pageSize,
        keyword: this.state.keyword,
      })
      .then(res => {
        this.setState({ numOfPages: res.data.numOfPages });
        this.setState({ data: res.data.studentData });
        this.setState({ isLoadingTable: false });
      });
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    axios.get('api/registrar/getpastsy').then(res => {
      this.setState({ schoolYearID: res.data.schoolYearID, schoolYear: res.data.schoolYear });
      axios.post('api/registrar/sectiongradelevel', { sectionID: this.props.id }).then(res => {
        this.setState({ gradeLevel: res.data.gradeLevel });
        axios
          .post('api/registrar/getpastgradelevel', { gradeLevel: res.data.gradeLevel })
          .then(res2 => {
            this.setState({ pastGradeLevel: res2.data.gradeLevel });
            this.setState({ isLoading: false });
            axios
              .post('api/registrar/getpastrecords', {
                page: this.state.page,
                pageSize: this.state.pageSize,
                keyword: this.state.keyword,
                gradeLevel: res.data.gradeLevel,
              })
              .then(res3 => {
                axios.post('api/registrar/sectionname', { sectionID: this.props.id }).then(res4 => {
                  this.setState({ sectionName: res4.data.sectionName });
                  this.setState({ numOfPages: res3.data.numOfPages });
                  this.setState({ data: res3.data.studentData });
                  this.setState({ isLoadingTable: false });
                });
              })
              .catch(err => {
                this.setState({ isLoadingTable: false });
              });
          });
      });
    });
  }

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
          <Table.Col className="w-1">
            <Avatar
              imageURL={value.imageUrl == 'NA' ? getPlaceholder() : getImageUrl(value.imageUrl)}
            />
          </Table.Col>
          <Table.Col>{value.studentName}</Table.Col>
          <Table.Col>{value.email}</Table.Col>
          <Table.Col>{value.sectionName}</Table.Col>
          <Table.Col alignContent="center">
            <Button
              icon="plus"
              color="primary"
              value="ASD"
              onClick={() => {
                this.enrollStudent(value.studentID);
              }}
            >
              {`Enroll Student to ${this.state.sectionName}`}
            </Button>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <Table.Body className="app-registrar-view-past-records my-3 my-md-5 card">
        <Card.Body>
          {this.state.isLoading ? (
            ''
          ) : (
            <div>
              <Card.Title>
                <Breadcrumb>
                  <Breadcrumb.Item>Sections</Breadcrumb.Item>
                  <Breadcrumb.Item>Manage Students</Breadcrumb.Item>
                  <Breadcrumb.Item>{this.state.sectionName}</Breadcrumb.Item>
                  <Breadcrumb.Item>View Past Records</Breadcrumb.Item>
                  <Breadcrumb.Item>{`${displayGradeLevel(this.state.pastGradeLevel)} S.Y. ${
                    this.state.schoolYear
                  }`}</Breadcrumb.Item>
                </Breadcrumb>
              </Card.Title>
              <Card.Title>{`All Students from ${displayGradeLevel(
                this.state.pastGradeLevel,
              )} S.Y. ${this.state.schoolYear}`}</Card.Title>
            </div>
          )}
          <Grid.Row>
            <Grid.Col sm={12} md={12} xs={12}>
              <Grid.Row>
                <Grid.Col sm={12} md={12} xs={12}>
                  <Form.Group>
                    <Form.Input
                      icon="search"
                      placeholder="Seach for..."
                      position="append"
                      name="keyword"
                      value={this.state.keyword}
                      onChange={this.onChangeSearch}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Spin spinning={this.state.isLoadingTable}>
                <Table highlightRowOnHover={true} responsive={true}>
                  <Table.Header>
                    <Table.ColHeader colSpan={2}>Student Name</Table.ColHeader>
                    <Table.ColHeader>Email Address</Table.ColHeader>
                    <Table.ColHeader>Section</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Action</Table.ColHeader>
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
      </Table.Body>
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
)(RegistrarViewPastRecords);
