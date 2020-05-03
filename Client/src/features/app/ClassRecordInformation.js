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
import placeholder from '../../images/placeholder.jpg';
import bg from '../../images/BG.png';
import { getImageUrl } from '../../utils';
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.classRecordID != -1) {
      this.setState({ isLoading: true });
      axios
        .post('api/registrar/getclassrecinfo', {
          classRecordID: nextProps.classRecordID,
          quarter: nextProps.quarter,
          page: this.state.page,
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
          this.setState({ isLoading: false, hasData: true, data: [], numOfPages: 1 });
        });
    } else {
      this.setState({ hasData: false, data: [] });
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
          this.setState({ isLoading: false, hasData: true, data: [], numOfPages: 1 });
        });
    });
  };

  render() {
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar imageURL={value.imageUrl == 'NA' ? placeholder : getImageUrl(value.imageUrl)} />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col alignContent="center">
            {value.grade == -1 ? 'Not yet available' : value.grade}
          </Table.Col>
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
                      <Descriptions.Item span={3} label="Number of students">
                        {this.state.data.length}
                      </Descriptions.Item>
                    </Descriptions>
                  </Grid.Col>
                  <Table highlightRowOnHover={true} responsive={true}>
                    <Table.Header>
                      <Table.ColHeader></Table.ColHeader>
                      <Table.ColHeader>Student Name</Table.ColHeader>
                      <Table.ColHeader alignContent="center">Final Grade</Table.ColHeader>
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
                  <Grid.Col sm={12} xs={12} md={12}>
                    <Button.List align="right">
                      <Button icon="file" color="primary">
                        <Link
                          style={{ color: 'white' }}
                          to={`/individualdeliberation/${this.props.id}/managegrade/${this.props.classRecordID}/quarter/${this.props.quarter}`}
                        >
                          Edit Grade
                        </Link>
                      </Button>
                      <Button icon="check" color="success" onClick={() => this.handlePostGrade()}>
                        Post Grades
                      </Button>
                    </Button.List>
                  </Grid.Col>
                </Grid.Row>
              </Container>
            )}
          </Spin>
        </Card.Body>
      </Card>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {};
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassRecordInformation);
