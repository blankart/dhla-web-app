import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Button, Grid, Table, Form, Container } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
export class RegistrarManageStudents extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      keyword: '',
      page: 1,
      pageSize: 10,
      numOfPages: 1,
      data: [],
      selectedKey: 0,
    };

    this.onChangeSearch = this.onChangeSearch.bind(this);
  }

  onChangeSearch(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ isLoading: true, page: 1 });
    axios
      .post('api/registrar/getsections', {
        keyword: event.target.value,
        page: 1,
        pageSize: this.state.pageSize,
      })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({ numOfPages: res.data.numOfPages, data: res.data.sectionList });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        this.setState({ data: [] });
      });
  }

  paginate = page => {
    this.setState({
      page,
    });
    this.setState({ isLoading: true });
    axios
      .post('api/registrar/getsections', {
        keyword: this.state.keyword,
        page,
        pageSize: this.state.pageSize,
      })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.sectionList,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    axios
      .post('api/registrar/getsections', { keyword: '', page: 1, pageSize: 10 })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({ numOfPages: res.data.numOfPages, data: res.data.sectionList });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  componentWillReceiveProps() {
    this.setState({ isLoading: true });
    axios
      .post('api/registrar/getsections', {
        keyword: this.state.keyword,
        page: this.state.page,
        pageSize: 10,
      })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({ numOfPages: res.data.numOfPages, data: res.data.sectionList });
      })
      .catch(err => {
        this.setState({ isLoading: false });
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
    const { errors } = this.props.app;
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{displayGradeLevel(value.gradeLevel)}</Table.Col>
          <Table.Col alignContent="center">
            <Link to={`/managestudents/viewenrolled/${value.key}`}>
              <Button icon="user" size="sm" pill color="primary">
                View Enrolled Students
              </Button>
            </Link>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <Table.Body className="app-registrar-enroll-students my-3 my-md-5 card">
        <Card.Body>
          <Card.Title>
            <Breadcrumb>
              <Breadcrumb.Item>Sections</Breadcrumb.Item>
              <Breadcrumb.Item>Manage Students</Breadcrumb.Item>
            </Breadcrumb>
          </Card.Title>
          <Card.Title>Manage Students</Card.Title>
          <Grid.Row>
            <Grid.Col sm={12} md={12} xs={12}>
              <Grid.Row>
                <Grid.Col sm={12} md={12} xs={12}>
                  <Form.Group>
                    <Form.Input
                      icon="search"
                      placeholder="Search for..."
                      position="append"
                      name="keyword"
                      value={this.state.keyword}
                      onChange={this.onChangeSearch}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Spin spinning={this.state.isLoading}>
                <Table highlightRowOnHover={true} responsive={true}>
                  <Table.Header>
                    <Table.ColHeader>Section Name</Table.ColHeader>
                    <Table.ColHeader>Grade Level</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Action</Table.ColHeader>
                  </Table.Header>
                  <Table.Body>
                    {DisplayData.length == 0 ? (
                      <Table.Row>
                        <Table.Col colSpan={3} alignContent="center">
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarManageStudents);
