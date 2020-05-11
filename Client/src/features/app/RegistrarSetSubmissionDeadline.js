import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Container, Form, Grid, Button, Table, Avatar } from 'tabler-react';
import { Spin, Pagination, Modal } from 'antd';
import { getImageUrl, getPlaceholder } from '../../utils';
import placeholder from '../../images/placeholder.jpg';
import axios from 'axios';
import moment from 'moment';

export class RegistrarSetSubmissionDeadline extends Component {
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
      numOfPagaes: 1,
      data: [],
      selectedKey: -1,
      selectedDeadlineID: -1,
      errors: {},
      showModal: false,
      modalLoading: false,
      teacher: '',
      date: new Date(),
      deadline: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.removeDeadline = this.removeDeadline.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
  }

  removeDeadline = () => {
    this.props.actions.removeDeadline({ deadlineID: this.state.selectedDeadlineID });
  };

  showDeleteModal = () => {
    Modal.confirm({
      title: 'Are you sure you want to remove the deadline?',
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        this.removeDeadline();
      },
      onCancel: () => {
        console.log('closed');
      },
    });
  };

  onDateChange = event => {
    this.setState({ date: event });
  };
  setDeadline = () => {
    if (this.state.selectedKey == 0) {
      let { date } = this.state;
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      this.props.actions.setDeadlineAll({ deadline: date.toISOString() });
    } else {
      let { date } = this.state;
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      this.props.actions.setDeadline({
        teacherID: this.state.selectedKey,
        deadline: date.toISOString(),
      });
    }
  };

  componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      axios
        .post('api/registrar/getallteachers', {
          page: this.state.page,
          pageSize: this.state.pageSize,
          keyword: this.state.keyword,
        })
        .then(res => {
          this.setState({ isLoading: false }, () => {
            this.setState({ numOfPages: res.data.numOfPages, data: res.data.accountList });
          });
        });
    });
  }

  paginate = page => {
    this.setState({ isLoading: true, page }, () => {
      axios
        .post('api/registrar/getallteachers', {
          page,
          pageSize: this.state.pageSize,
          keyword: this.state.keyword,
        })
        .then(res => {
          this.setState({ isLoading: false }, () => {
            this.setState({ numOfPages: res.data.numOfPages, data: res.data.accountList });
          });
        });
    });
  };

  onChange = e => {
    this.setState({ isLoading: true, page: 1, [e.target.name]: e.target.value }, () => {
      axios
        .post('api/registrar/getallteachers', {
          page: this.state.page,
          pageSize: this.state.pageSize,
          keyword: this.state.keyword,
        })
        .then(res => {
          this.setState({ isLoading: false }, () => {
            this.setState({ numOfPages: res.data.numOfPages, data: res.data.accountList });
          });
        })
        .catch(err => {
          this.setState({ isLoading: false }, () => {
            this.setState({ numOfPages: 1, data: [] });
          });
        });
    });
  };

  render() {
    const displayDate = date => {
      const disp = new Date(date);
      return disp.toDateString();
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
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.email}</Table.Col>
          <Table.Col>
            <Button
              size="sm"
              icon="edit"
              color="primary"
              onClick={() =>
                this.setState({
                  selectedKey: value.teacherID,
                  teacher: value.name,
                  showModal: true,
                  deadline: value.deadline ? value.deadline : 'NOT SET',
                  date: new Date(),
                  selectedDeadlineID: value.deadlineID,
                })
              }
            >
              Set deadline
            </Button>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <Container>
        <div className="app-registrar-set-submission-deadline card">
          <Modal
            title={`Set deadline for ${this.state.teacher}`}
            visible={this.state.showModal}
            onOk={this.setDeadline}
            onCancel={() => {
              this.setState({ selectedKey: -1, showModal: false, teacher: '' });
            }}
            okText="Set deadline"
            confirmLoading={this.props.app.showLoading}
            cancelText="Close"
          >
            <Spin spinning={this.props.app.showLoading}>
              <Container>
                <Grid.Row>
                  <Grid.Col sm={12} md={12}>
                    <Form.Group>
                      {this.state.deadline == 'all' ? (
                        ''
                      ) : (
                        <h4>
                          Current deadline set:{' '}
                          <b>
                            {this.state.deadline == 'NOT SET'
                              ? 'NOT SET'
                              : displayDate(this.state.deadline)}
                          </b>
                        </h4>
                      )}
                      <Form.Label>Deadline</Form.Label>
                      <Form.DatePicker
                        defaultDate={new Date()}
                        format="mm/dd/yyyy"
                        onChange={this.onDateChange}
                        name="deadline"
                        monthLabels={[
                          'January',
                          'February',
                          'March',
                          'April',
                          'May',
                          'June',
                          'July',
                          'August',
                          'September',
                          'October',
                          'November',
                          'December',
                        ]}
                        maxYear={3000}
                      ></Form.DatePicker>
                    </Form.Group>
                  </Grid.Col>
                  {this.state.selectedDeadlineID != -1 && (
                    <Grid.Col sm={12} md={12}>
                      <Form.Group>
                        <Button color="danger" icon="trash" onClick={this.showDeleteModal}>
                          Remove {this.state.selectedDeadlineID == 0 ? 'all' : ''} deadline
                        </Button>
                      </Form.Group>
                    </Grid.Col>
                  )}
                </Grid.Row>
              </Container>
            </Spin>
          </Modal>
          <Card.Header>
            <Card.Title>Set Submission Deadline</Card.Title>
          </Card.Header>
          <Card.Body>
            <Grid.Row>
              <Grid.Col sm={12} md={8} xs={12}>
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
              </Grid.Col>
              <Grid.Col sm={12} md={4} xs={12}>
                <Button
                  block
                  color="primary"
                  icon="edit"
                  onClick={() => {
                    this.setState({
                      showModal: true,
                      selectedKey: 0,
                      teacher: 'all teachers',
                      deadline: 'all',
                      date: new Date(),
                      selectedDeadlineID: 0,
                    });
                  }}
                >
                  Set to all
                </Button>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col sm={12} xs={12} md={12}>
                <Spin spinning={this.state.isLoading}>
                  <Table highlightRowOnHover={true} responsive={true}>
                    <Table.Header>
                      <Table.ColHeader colSpan={2}>Name</Table.ColHeader>
                      <Table.ColHeader>Email</Table.ColHeader>
                      <Table.ColHeader>Action</Table.ColHeader>
                    </Table.Header>
                    <Table.Body>
                      {DisplayData.length !== 0 ? (
                        DisplayData
                      ) : (
                        <Table.Row>
                          <Table.Col colSpan={4} alignContent="center">
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
      </Container>
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
)(RegistrarSetSubmissionDeadline);
