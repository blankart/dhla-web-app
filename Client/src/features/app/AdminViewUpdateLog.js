import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Button, Grid, Avatar, Table, Form } from 'tabler-react';
import { Spin, Pagination } from 'antd';
import moment from 'moment';
import axios from 'axios';

export class AdminViewUpdateLog extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      page: 1,
      pageSize: 5,
      numOfPages: 1,
      data: [
        {
          gradeSheetID: '',
          schoolYear: '',
          academicTerm: '',
          teacherName: '',
          gradeLevel: '',
          subjectName: '',
          sectionName: '',
          dateUpdated: '',
          studentName: '',
          entryNum: '',
          category: '',
          total: '',
          oldGrade: {},
          newGrade: {},
        },
        {
          gradeSheetID: '',
          schoolYear: '',
          academicTerm: '',
          teacherName: '',
          gradeLevel: '',
          subjectName: '',
          sectionName: '',
          dateUpdated: '',
          studentName: '',
          entryNum: '',
          category: '',
          total: '',
          oldGrade: {},
          newGrade: {},
        },
        {
          gradeSheetID: '',
          schoolYear: '',
          academicTerm: '',
          teacherName: '',
          gradeLevel: '',
          subjectName: '',
          sectionName: '',
          dateUpdated: '',
          studentName: '',
          entryNum: '',
          category: '',
          total: '',
          oldGrade: {},
          newGrade: {},
        },
        {
          gradeSheetID: '',
          schoolYear: '',
          academicTerm: '',
          teacherName: '',
          gradeLevel: '',
          subjectName: '',
          sectionName: '',
          dateUpdated: '',
          studentName: '',
          entryNum: '',
          category: '',
          total: '',
          oldGrade: {},
          newGrade: {},
        },
        {
          gradeSheetID: '',
          schoolYear: '',
          academicTerm: '',
          teacherName: '',
          gradeLevel: '',
          subjectName: '',
          sectionName: '',
          dateUpdated: '',
          studentName: '',
          entryNum: '',
          category: '',
          total: '',
          oldGrade: {},
          newGrade: {},
        },
      ],
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    axios
      .post('api/admin/getupdatelog', { page: 1, pageSize: 5 })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.updateLog,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  paginate = page => {
    this.setState({
      page,
    });
    this.setState({ isLoading: true });
    axios
      .post('api/admin/getupdatelog', { page, pageSize: this.state.pageSize })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.updateLog,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  };

  render() {
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col>{moment(value.dateUpdated).format('MMMM d YYYY hh:mm:ss')}</Table.Col>
          <Table.Col>{value.teacherName}</Table.Col>
          <Table.Col>{value.studentName}</Table.Col>
          <Table.Col>{value.sectionName}</Table.Col>
          <Table.Col>{value.subjectName}</Table.Col>
          <Table.Col>
            <Button icon="info" size="sm" pill color="info">
              Details
            </Button>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-admin-view-update-log card">
        <Card.Body>
          <Card.Title>Grades Update Log</Card.Title>
          <Grid.Row>
            <Grid.Col sm={12} md={12} xs={12}>
              <Spin spinning={this.state.isLoading}>
                <Table highlightRowOnHover={true} responsive={true}>
                  <Table.Header>
                    <Table.ColHeader>Date</Table.ColHeader>
                    <Table.ColHeader>Teacher</Table.ColHeader>
                    <Table.ColHeader>Student</Table.ColHeader>
                    <Table.ColHeader>Section</Table.ColHeader>
                    <Table.ColHeader>Subject</Table.ColHeader>
                    <Table.ColHeader>Details</Table.ColHeader>
                  </Table.Header>
                  <Table.Body>{DisplayData}</Table.Body>
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
)(AdminViewUpdateLog);
