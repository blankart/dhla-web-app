import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Button, Grid, Avatar, Table, Form, Container } from 'tabler-react';
import { Pagination, Spin, Popconfirm, Modal, Tooltip } from 'antd';
import { getImageUrl, getPlaceholder } from '../../utils';
import axios from 'axios';

export class AdminActivateAccount extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoading2: true,
      keyword: '',
      page: 1,
      pageSize: 5,
      numOfPages: 1,
      data: [],
      selectedKey: -1,
      showModal: false,
      selectedID: -1,
      parentKeyword: '',
      parentPage: 1,
      parentPageSize: 5,
      parentNumOfPages: 1,
      parentData: [],
      listParents: [],
    };
    this.onChange = this.onChange.bind(this);
  }

  handleParentSearch = () => {
    axios
      .post('api/admin/getallparents', {
        accountID: this.state.selectedID,
        keyword: this.state.parentKeyword,
        page: this.state.parentPage,
        pageSize: this.state.parentPageSize,
      })
      .then(res =>
        this.setState({
          isLoading2: false,
          parentNumOfPages: res.data.numOfPages,
          parentData: res.data.accountList,
          listParents: res.data.listParents,
        }),
      )
      .catch(err =>
        this.setState({
          isLoading2: false,
          parentNumOfPages: 1,
          parentData: [],
          parentPage: 1,
          listParents: [],
        }),
      );
  };

  paginate2 = page => {
    axios
      .post('api/admin/getallparents', {
        keyword: this.state.parentKeyword,
        page: page,
        pageSize: this.state.parentPageSize,
      })
      .then(res =>
        this.setState({
          isLoading2: false,
          parentNumOfPages: res.data.numOfPages,
          parentData: res.data.accountList,
          listParents: res.data.listParents,
        }),
      )
      .catch(err =>
        this.setState({
          isLoading2: false,
          parentNumOfPages: 1,
          parentData: [],
          parentPage: 1,
          listParents: [],
        }),
      );
  };

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
        this.setState({ isLoading: false, numOfPages: 1, data: [], page: 1 });
      });
  };

  onChange(event) {
    this.setState({
      isLoading: true,
      page: 1,
    });
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
        this.setState({ isLoading: false, data: [] });
      });
  }

  deactivateAccount(accountID) {
    this.props.actions.deactivateAccount({ accountID });
  }

  handleDeleteAccount = () => {
    Modal.confirm({
      title: 'Delete an Account',
      content: 'Do you want to delete this account?',
      onOk: () => this.deactivateAccount(this.state.selectedKey),
    });
  };
  componentWillReceiveProps() {
    this.setState({ isLoading: true });
    axios
      .post('api/admin/getaccounts', { keyword: '', page: this.state.page, pageSize: 5 })
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
          <Table.Col>{value.position}</Table.Col>
          <Table.Col>
            <Button.List>
              {value.position == 'Student' && (
                <Tooltip title="Assign a parent">
                  <Button
                    icon="user"
                    size="sm"
                    pill
                    color="primary"
                    onClick={() =>
                      this.setState(
                        { showModal: true, selectedID: value.key, parentData: [], listParents: [] },
                        () => this.handleParentSearch(),
                      )
                    }
                  ></Button>
                </Tooltip>
              )}
              <Button
                icon="trash"
                size="sm"
                pill
                color="danger"
                value={value.key}
                onClick={() =>
                  this.setState({ selectedKey: value.key }, () => this.handleDeleteAccount())
                }
              ></Button>
            </Button.List>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-admin-activate-account card">
        <Modal
          title="Assign Parent to Student"
          visible={this.state.showModal}
          onOk={() => {
            this.handleAssignParent();
          }}
          onCancel={() => this.setState({ showModal: false })}
          footer={[
            <Button onClick={() => this.setState({ showModal: false, listParents: [] })}>
              Close
            </Button>,
          ]}
          cancelText="Cancel"
        >
          <Grid.Row>
            <Grid.Col sm={12} xs={12} md={12}>
              <Form.Group>
                <Form.Label>Search for parent</Form.Label>
                <Form.Input
                  value={this.state.parentKeyword}
                  onChange={e =>
                    this.setState({ parentKeyword: e.target.value }, () =>
                      this.handleParentSearch(),
                    )
                  }
                  placeholder="Search for..."
                />
              </Form.Group>
            </Grid.Col>
            <Grid.Col sm={12} xs={12} md={12}>
              <Spin spinning={this.state.isLoading2}>
                <Table highlightRowOnHover={true} responsive={true}>
                  <Table.Header>
                    <Table.ColHeader></Table.ColHeader>
                    <Table.ColHeader>Name</Table.ColHeader>
                    <Table.ColHeader>Email</Table.ColHeader>
                    <Table.ColHeader>Actions</Table.ColHeader>
                  </Table.Header>
                  <Table.Body>
                    {this.state.parentData.length == 0 ? (
                      <Table.Row>
                        <Table.Col colSpan={4} alignContent="center">
                          No entries.
                        </Table.Col>
                      </Table.Row>
                    ) : (
                      this.state.parentData.map(value => (
                        <Table.Row>
                          <Table.Col className="w-1">
                            <Avatar
                              imageURL={
                                value.imageUrl == 'NA'
                                  ? getPlaceholder()
                                  : getImageUrl(value.imageUrl)
                              }
                            />
                          </Table.Col>
                          <Table.Col>{value.name}</Table.Col>
                          <Table.Col>{value.email}</Table.Col>
                          <Table.Col>
                            {this.state.listParents.length == 0 ? (
                              <Button
                                icon="user"
                                color="primary"
                                pill
                                size="sm"
                                onClick={() =>
                                  this.props.actions.assignParent({
                                    accountID: this.state.selectedID,
                                    parentID: value.key,
                                  })
                                }
                              >
                                Assign
                              </Button>
                            ) : !this.state.listParents.find(a => a.accountID == value.key) ? (
                              <Button
                                icon="user"
                                color="primary"
                                pill
                                size="sm"
                                onClick={() =>
                                  this.props.actions.assignParent({
                                    accountID: this.state.selectedID,
                                    parentID: value.key,
                                  })
                                }
                              >
                                Assign
                              </Button>
                            ) : (
                              ''
                            )}
                            {this.state.listParents.length != 0 &&
                              this.state.listParents.find(a => a.accountID == value.key) && (
                                <Button
                                  icon="user"
                                  color="danger"
                                  pill
                                  size="sm"
                                  onClick={() =>
                                    this.props.actions.unassignParent({
                                      accountID: this.state.selectedID,
                                      parentID: value.key,
                                    })
                                  }
                                >
                                  Unassign
                                </Button>
                              )}
                          </Table.Col>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table>
                <Pagination
                  size="large"
                  current={this.state.parentPage}
                  pageSize={this.state.parentPageSize}
                  total={this.state.parentPageSize * this.state.parentNumOfPages}
                  onChange={this.paginate2}
                />
              </Spin>
            </Grid.Col>
          </Grid.Row>
        </Modal>
        <Card.Body>
          <Card.Title>Accounts List</Card.Title>
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
                  <Table.Body>
                    {DisplayData.length !== 0 ? (
                      DisplayData
                    ) : (
                      <Table.Row>
                        <Table.Col colSpan={5} alignContent="center">
                          No data to display.
                        </Table.Col>
                      </Table.Row>
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
