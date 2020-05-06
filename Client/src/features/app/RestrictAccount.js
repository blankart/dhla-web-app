import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Button, Grid, Avatar, Table, Form, Alert } from 'tabler-react';
import { Pagination, Spin, Popconfirm, Modal, message } from 'antd';
import { getImageUrl } from '../../utils';
import placeholder from '../../images/placeholder.jpg';
import axios from 'axios';

export class RestrictAccount extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      page: 1,
      numOfPages: 1,
      pageSize: 10,
      keyword: '',
      data: [],
      showModal: false,
      message: '',
      selectedID: -1,
    };
  }

  handleUnrestrict = () => {
    Modal.confirm({
      title: 'Unrestrict Account',
      content: 'Do you want to unrestrict this account?',
      okText: 'Unrestrict',
      cancelText: 'Cancel',
      onCancel: () => this.setState({ selectedID: -1 }),
      onOk: () => this.props.actions.unrestrictAccount({ accountID: this.state.selectedID }),
    });
  };

  handleOnSearch = () => {};

  componentDidMount() {
    axios
      .post('api/cashier/getallstudents', {
        page: this.state.page,
        pageSize: this.state.pageSize,
        keyword: this.state.keyword,
      })
      .then(res => {
        this.setState({
          isLoading: false,
          data: res.data.accountList,
          numOfPages: res.data.numOfPages,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false, data: [], numOfPages: 1 });
      });
  }

  render() {
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar imageURL={value.imageUrl == 'NA' ? placeholder : getImageUrl(value.imageUrl)} />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.email}</Table.Col>
          <Table.Col>
            {value.isActive ? (
              <Button
                size="sm"
                icon="lock"
                color="danger"
                onClick={() => this.setState({ selectedID: value.key, showModal: true })}
                pill
              ></Button>
            ) : (
              <Button
                size="sm"
                icon="unlock"
                color="success"
                onClick={() =>
                  this.setState({ selectedID: value.key }, () => this.handleUnrestrict())
                }
                pill
              ></Button>
            )}
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <React.Fragment>
        <Modal
          title="Restrict Account"
          visible={this.state.showModal}
          onOk={() => {
            this.props.actions.restrictAccount({
              accountID: this.state.selectedID,
              message: this.state.message,
            });
          }}
          onCancel={() => this.setState({ showModal: false, selectedID: -1 })}
          cancelText="Close"
          okText="Restrict Account"
        >
          <Grid.Row>
            <Grid.Col sm={12} xs={12} md={12}>
              <Alert icon="info" type="danger">
                Do you want to restrict this account? Leave a message for the student.
              </Alert>
              <Form.Group>
                <Form.Input
                  placeholder="Enter message here"
                  value={this.state.message}
                  onChange={e => this.setState({ message: e.target.value })}
                />
              </Form.Group>
            </Grid.Col>
          </Grid.Row>
        </Modal>
        <Card statusColor="warning">
          <Card.Body>
            <Card.Title>Restrict an Account</Card.Title>
            <Card.Body>
              <Grid.Row>
                <Grid.Col xs={12} md={12} sm={12}>
                  <Form.Group>
                    <Form.Label>Search Student</Form.Label>
                    <Form.Input
                      value={this.state.keyword}
                      onChange={e =>
                        this.setState({ keyword: e.target.value }, () => this.handleOnSearch())
                      }
                      placeholder="Search for..."
                    />
                  </Form.Group>
                </Grid.Col>
                <Grid.Col sm={12} xs={12} md={12}>
                  <Spin spinning={this.state.isLoading}>
                    <Table highlightRowOnHover={true} responsive={true}>
                      <Table.Header>
                        <Table.ColHeader></Table.ColHeader>
                        <Table.ColHeader>Name</Table.ColHeader>
                        <Table.ColHeader>Email</Table.ColHeader>
                        <Table.ColHeader>Actions</Table.ColHeader>
                      </Table.Header>
                      <Table.Body>
                        {DisplayData.length == 0 ? (
                          <Table.Row>
                            <Table.Col colSpan={4} alignContent="center">
                              No entries found.
                            </Table.Col>
                          </Table.Row>
                        ) : (
                          DisplayData
                        )}
                      </Table.Body>
                    </Table>
                  </Spin>
                </Grid.Col>
              </Grid.Row>
            </Card.Body>
          </Card.Body>
        </Card>
      </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(RestrictAccount);
