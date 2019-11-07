import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Button, Grid, Avatar, Table, Form } from 'tabler-react';
import { Pagination, Spin } from 'antd';
import axios from 'axios';

export class AdminActivateAccount extends Component {
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
      pageSize: 5,
      numOfPages: 1,
      data: [
        {
          key: 1,
          name: '',
          imageUrl: '',
          email: '',
          position: '',
          isActive: '',
        },
        {
          key: 2,
          name: '',
          imageUrl: '',
          email: '',
          position: '',
          isActive: '',
        },
        {
          key: 3,
          name: '',
          imageUrl: '',
          email: '',
          position: '',
          isActive: '',
        },
        {
          key: 4,
          name: '',
          imageUrl: '',
          email: '',
          position: '',
          isActive: '',
        },
        {
          key: 5,
          name: '',
          imageUrl: '',
          email: '',
          position: '',
          isActive: '',
        },
      ],
    };
    this.onChange = this.onChange.bind(this);
  }

  paginate = page => {
    this.setState({
      page,
    });
    this.setState({ isLoading: true });
    axios
      .post('api/admin/getaccounts', {
        keyword: this.state.keyword,
        page,
        pageSize: this.state.pageSize,
      })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.accountList,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  };

  onChange(event) {
    this.setState({ isLoading: true, page: 1 });
    this.setState({ [event.target.name]: event.target.value });
    axios
      .post('api/admin/getaccounts', { keyword: event.target.value, page: 1, pageSize: 5 })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.accountList,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  activateAccount(accountID) {
    this.props.actions.activateAccount({ accountID });
  }

  deactivateAccount(accountID) {
    this.props.actions.deactivateAccount({ accountID });
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    axios
      .post('api/admin/getaccounts', { keyword: '', page: 1, pageSize: 5 })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.accountList,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  componentWillReceiveProps() {
    this.setState({ isLoading: true });
    axios
      .post('api/admin/getaccounts', {
        keyword: this.state.keyword,
        page: this.state.page,
        pageSize: 5,
      })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.accountList,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar imageURL={value.imageUrl} />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.email}</Table.Col>
          <Table.Col>{value.position}</Table.Col>
          <Table.Col>
            {value.isActive == 0 ? (
              <Button
                icon="check"
                size="sm"
                pill
                color="success"
                onClick={() => this.activateAccount(value.key)}
              >
                Activate
              </Button>
            ) : (
              <Button
                icon="trash"
                size="sm"
                pill
                color="danger"
                value={value.key}
                onClick={() => this.deactivateAccount(value.key)}
              >
                Deactivate
              </Button>
            )}
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-admin-activate-account card">
        <Card.Body>
          <Card.Title>Activate/Deactivate an account</Card.Title>
          <Grid.Row>
            <Grid.Col sm={12} md={12} xs={12}>
              <Form.Group>
                <Form.Input
                  icon="search"
                  placeholder="Search for..."
                  position="append"
                  name="keyword"
                  value={this.state.keyword}
                  onChange={this.onChange}
                />
              </Form.Group>
              <Spin spinning={this.state.isLoading}>
                <Table highlightRowOnHover={true} responsive={true}>
                  <Table.Header>
                    <Table.ColHeader colSpan={2}>Name</Table.ColHeader>
                    <Table.ColHeader>Email</Table.ColHeader>
                    <Table.ColHeader>Position</Table.ColHeader>
                    <Table.ColHeader>Action</Table.ColHeader>
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
)(AdminActivateAccount);