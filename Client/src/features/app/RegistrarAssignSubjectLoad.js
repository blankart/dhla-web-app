import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Button, Grid, Avatar, Table, Form } from 'tabler-react';
import { Pagination, Spin, Breadcrumb } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import placeholder from '../../images/placeholder.jpg';
import { getImageUrl, getPlaceholder } from '../../utils';

export class RegistrarAssignSubjectLoad extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingTable: true,
      keyword: '',
      page: 1,
      pageSize: 10,
      numOfPages: 1,
      data: [],
      schoolYearID: 0,
      schoolYear: '',
    };

    this.onChangeSearch = this.onChangeSearch.bind(this);
  }

  onChangeSearch(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ isLoadingTable: true, page: 1 });
    axios
      .post('api/registrar/getallteachers', {
        keyword: event.target.value,
        page: 1,
        pageSize: this.state.pageSize,
      })
      .then(res => {
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.accountList,
          isLoadingTable: false,
        });
      })
      .catch(err => {
        this.setState({ isLoadingTable: false, data: [] });
      });
  }

  paginate = page => {
    this.setState({ page });
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/getallteachers', {
        keyword: this.state.keyword,
        page: page,
        pageSize: this.state.pageSize,
      })
      .then(res => {
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.accountList,
          isLoadingTable: false,
        });
      })
      .catch(err => {
        this.setState({ isLoadingTable: false, data: [] });
      });
  };

  componentDidMount() {
    this.setState({ isLoading: true, isLoadingTable: true });
    axios.get('api/registrar/getsy').then(res => {
      this.setState({ schoolYearID: res.data.schoolYearID, schoolYear: res.data.schoolYear });
      this.setState({ isLoading: false });
      axios
        .post('api/registrar/getallteachers', {
          keyword: this.state.keyword,
          page: this.state.page,
          pageSize: this.state.pageSize,
        })
        .then(res2 => {
          this.setState({
            numOfPages: res2.data.numOfPages,
            data: res2.data.accountList,
            isLoadingTable: false,
          });
        })
        .catch(err => {
          this.setState({ isLoadingTable: false });
        });
    });
  }

  render() {
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar
              imageURL={value.imageUrl == 'NA' ? getPlaceholder() : getImageUrl(value.imageUrl)}
            />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.email}</Table.Col>
          <Table.Col alignContent="center">
            <Link to={`/assignsubjectload/viewload/${value.key}`}>
              <Button icon="user" color="primary">
                View Subject Load
              </Button>
            </Link>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <Table.Body className="app-registrar-assign-subject-load card my-3 my-md-5">
        <Card.Body>
          {this.state.isLoading ? (
            ''
          ) : (
            <div>
              <Card.Title>
                <Breadcrumb>
                  <Breadcrumb.Item>Teachers</Breadcrumb.Item>
                  <Breadcrumb.Item>Assign Subject Load</Breadcrumb.Item>
                </Breadcrumb>
              </Card.Title>
              <Card.Title>Assign Subject Load for S.Y. {this.state.schoolYear}</Card.Title>
            </div>
          )}
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
              <Spin spinning={this.state.isLoadingTable}>
                <Table highlightRowOnHover={true} responsive={true}>
                  <Table.Header>
                    <Table.ColHeader colSpan={2}>Teacher Name</Table.ColHeader>
                    <Table.ColHeader>Email</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Action</Table.ColHeader>
                  </Table.Header>
                  <Table.Body>
                    {DisplayData.length == 0 ? (
                      <Table.Row>
                        <Table.Col colSpan={4} alignContent="center">
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
)(RegistrarAssignSubjectLoad);
