import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip, Descriptions, Typography } from 'antd';
import { Modal, Popconfirm, Search, Breadcrumb, AutoComplete, Input, message, Empty } from 'antd';
import cn from 'classnames';
import bg from '../../images/BG.png';
import { getImageUrl, getPlaceholder } from '../../utils';
const { Option } = AutoComplete;

export class ClassRecordInformation extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
      hasData: false,
      page: 1,
      pageSize: 10,
      numOfPages: 1,
    };
  }

  handlePostGrade = () => {
    Modal.confirm({
      title: 'Post Grades',
      content:
        'Do you want to post this class record? Once posted, it will be accessed by the students enrolled in the subject.',
      okText: 'Post',
      cancelText: 'Cancel',
      onCancel: () => {},
      onOk: () => {
        this.props.actions.postClassRecord(
          {
            classRecordID: this.props.classRecordID,
            quarter: this.props.quarter,
          },
          () => this.props.resetClassRecordInfo(),
        );
      },
    });
  };

  handleRevertToDeliberation = () => {
    Modal.confirm({
      title: 'Revert to Deliberation Status',
      content:
        'Do you want to revert the class record status? It will not longer be accessed by the students enrolled in the subject.',
      okText: 'Revert',
      cancelText: 'Cancel',
      onCancel: () => {},
      onOk: () => {
        this.props.actions.revertClassRecord(
          {
            classRecordID: this.props.classRecordID,
            quarter: this.props.quarter,
          },
          () => this.props.resetClassRecordInfo(),
        );
      },
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.classRecordID != -1 && this.props.quarter == nextProps.quarter) {
      this.setState({ isLoading: true });
      axios
        .post('api/registrar/getclassrecinfo', {
          classRecordID: nextProps.classRecordID,
          quarter: nextProps.quarter,
          page: 1,
          pageSize: this.state.pageSize,
        })
        .then(res => {
          this.setState({
            isLoading: false,
            hasData: true,
            page: 1,
            data: res.data.studentList,
            numOfPages: res.data.numOfPages,
          });
        })
        .catch(err => {
          this.setState({ isLoading: false, hasData: true, data: [], numOfPages: 1, page: 1 });
        });
    } else {
      this.setState({ hasData: false, data: [], page: 1 });
    }
  }

  paginate = page => {
    this.setState({ page, isLoading: true }, () => {
      axios
        .post('api/registrar/getclassrecinfo', {
          classRecordID: this.props.classRecordID,
          quarter: this.props.quarter,
          page: page,
          pageSize: this.state.pageSize,
        })
        .then(res => {
          this.setState({
            isLoading: false,
            hasData: true,
            data: res.data.studentList,
            numOfPages: res.data.numOfPages,
          });
        })
        .catch(err => {
          this.setState({ isLoading: false, hasData: true, data: [], numOfPages: 1, page: 1 });
        });
    });
  };

  render() {
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      let check = value.q1Grade
        ? value.q2Grade
          ? value.q3Grade
            ? 'q3Grade'
            : 'q2Grade'
          : 'q1Grade'
        : '';
      DisplayData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar
              imageURL={value.imageUrl == 'NA' ? getPlaceholder() : getImageUrl(value.imageUrl)}
            />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col alignContent="center">
            {(value.grade != -1 || value.grade != 'N/A') && (
              <span
                className={`status-icon bg-${parseFloat(value.grade) >= 75 ? 'green' : 'red'}`}
              />
            )}
            {value.grade == -1 ? 'N/A' : value.grade}
          </Table.Col>
          {check != '' && (
            <Table.Col alignContent="center">
              {value[check] == -1 ? (
                'N/A'
              ) : (
                <React.Fragment>
                  <span
                    className={`status-icon bg-${
                      parseFloat(value.grade) - parseFloat(value[check]) >= 0 ? 'green' : 'red'
                    }`}
                  />
                  {parseFloat(value.grade) - parseFloat(value[check])}
                </React.Fragment>
              )}
            </Table.Col>
          )}
          {value.q3Grade && (
            <React.Fragment>
              <Table.Col alignContent="center">
                {value.q3Grade && (value.q3Grade != -1 || value.q3Grade != 'N/A') && (
                  <span
                    className={`status-icon bg-${
                      parseFloat(value.q3Grade) >= 75 ? 'green' : 'red'
                    }`}
                  />
                )}
                {value.q3Grade == -1 ? 'N/A' : value.q3Grade}
              </Table.Col>
            </React.Fragment>
          )}
          {value.q2Grade && (
            <React.Fragment>
              <Table.Col alignContent="center">
                {value.q2Grade && (value.q2Grade != -1 || value.q2Grade != 'N/A') && (
                  <span
                    className={`status-icon bg-${
                      parseFloat(value.q2Grade) >= 75 ? 'green' : 'red'
                    }`}
                  />
                )}
                {value.q2Grade == -1 ? 'N/A' : value.q2Grade}
              </Table.Col>
            </React.Fragment>
          )}
          {value.q1Grade && (
            <React.Fragment>
              <Table.Col alignContent="center">
                {value.q1Grade && (value.q1Grade != -1 || value.q1Grade != 'N/A') && (
                  <span
                    className={`status-icon bg-${
                      parseFloat(value.q1Grade) >= 75 ? 'green' : 'red'
                    }`}
                  />
                )}
                {value.q1Grade == -1 ? 'N/A' : value.q1Grade}
              </Table.Col>
            </React.Fragment>
          )}
        </Table.Row>,
      );
    }
    return (
      <Card>
        <Card.Body>
          <Card.Title>Class Record Information</Card.Title>
          <Spin spinning={this.state.isLoading}>
            {!this.state.hasData ? (
              <Container>
                <Empty description="There is no selected subject." />
              </Container>
            ) : (
              <Container>
                <Grid.Row>
                  <Grid.Col sm={12} xs={12} md={12}>
                    <Descriptions
                      style={{ marginBottom: '15px', marginTop: '15px' }}
                      bordered
                      title="Class Record Information"
                    >
                      <Descriptions.Item span={3} label="Subject Code">
                        {this.props.subjectCode}
                      </Descriptions.Item>
                      <Descriptions.Item span={3} label="Subject Name">
                        {this.props.subjectName}
                      </Descriptions.Item>
                      <Descriptions.Item span={3} label="Section Name">
                        {this.props.section}
                      </Descriptions.Item>
                      <Descriptions.Item span={3} label="Deadline">
                        {this.props.deadline}
                      </Descriptions.Item>
                    </Descriptions>
                  </Grid.Col>
                  <Table highlightRowOnHover={true} responsive={true}>
                    <Table.Header>
                      <Table.ColHeader></Table.ColHeader>
                      <Table.ColHeader>Student Name</Table.ColHeader>
                      <Table.ColHeader alignContent="center">Final Grade</Table.ColHeader>
                      {this.state.data.length != 0 && this.state.data[0].q1Grade && (
                        <Table.ColHeader alignContent="center">Deliberation Column</Table.ColHeader>
                      )}
                      {this.state.data.length != 0 && this.state.data[0].q3Grade && (
                        <React.Fragment>
                          <Table.ColHeader alignContent="center">Q3 Grade</Table.ColHeader>
                        </React.Fragment>
                      )}
                      {this.state.data.length != 0 && this.state.data[0].q2Grade && (
                        <React.Fragment>
                          <Table.ColHeader alignContent="center">Q2 Grade</Table.ColHeader>
                        </React.Fragment>
                      )}
                      {this.state.data.length != 0 && this.state.data[0].q1Grade && (
                        <React.Fragment>
                          <Table.ColHeader alignContent="center">Q1 Grade</Table.ColHeader>
                        </React.Fragment>
                      )}
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
                </Grid.Row>
              </Container>
            )}
          </Spin>
        </Card.Body>
        {!this.state.isLoading ? (
          this.state.hasData ? (
            <Card.Footer>
              <Grid.Col sm={12} xs={12} md={12}>
                {this.props.status == 'deliberation' && (
                  <Button.List align="right">
                    <Button icon="file" color="primary">
                      <Link
                        style={{ color: 'white' }}
                        to={`/individualdeliberation/${this.props.id}/managegrade/${this.props.classRecordID}/quarter/${this.props.quarter}`}
                        target="_blank"
                      >
                        Edit Class Record
                      </Link>
                    </Button>
                    <Button icon="check" color="success" onClick={() => this.handlePostGrade()}>
                      Post Grades
                    </Button>
                  </Button.List>
                )}
              </Grid.Col>
              <Grid.Col sm={12} xs={12} md={12}>
                <Grid.Row>
                  <Container>
                    {this.props.status == 'final' && (
                      <Button.List align="right">
                        <Button icon="eye" color="primary">
                          <Link
                            style={{ color: 'white' }}
                            to={`/viewstudentrecord/classrecord/${this.props.classRecordID}/q/${this.props.quarter}`}
                            target="_blank"
                          >
                            View Class Record
                          </Link>
                        </Button>
                        {!this.props.showRevert && this.props.auth.user.position == 2 && (
                          <Button
                            icon="arrow-left-circle"
                            color="danger"
                            onClick={() => this.handleRevertToDeliberation()}
                          >
                            Revert to Deliberation Status
                          </Button>
                        )}
                      </Button.List>
                    )}
                  </Container>
                </Grid.Row>
              </Grid.Col>
            </Card.Footer>
          ) : (
            ''
          )
        ) : (
          ''
        )}
      </Card>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    auth: state.app.auth,
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
)(ClassRecordInformation);
