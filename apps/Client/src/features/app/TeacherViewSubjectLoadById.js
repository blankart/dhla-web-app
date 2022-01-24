import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip } from 'antd';
import {
  Modal,
  Popconfirm,
  Search,
  Breadcrumb,
  AutoComplete,
  Input,
  message,
  Descriptions,
} from 'antd';
import RegistrarAddNewLoad from './RegistrarAddNewLoad';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import { getImageUrl, getPlaceholder } from '../../utils';
const { Option } = AutoComplete;

export class TeacherViewSubjectLoadById extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingTable: true,
      data: [],
      page: 1,
      pageSize: 10,
      numOfPages: 1,
      sectionName: '',
      gradeLevel: 'N',
      subjectName: '',
    };
  }

  componentDidMount() {
    axios
      .post('api/teacher/getsubsectinfo', {
        subsectID: this.props.subsectID,
        page: this.state.page,
        pageSize: this.state.pageSize,
      })
      .then(res => {
        this.setState({
          isLoading: false,
          isLoadingTable: false,
          numOfPages: res.data.numOfPages,
          sectionName: res.data.sectionName,
          gradeLevel: res.data.gradeLevel,
          data: res.data.studentList,
          subjectName: res.data.subjectName,
        });
      });
  }

  paginate = page => {
    this.setState({
      page,
    });

    this.setState({ isLoadingTable: true });
    axios
      .post('api/teacher/getsubsectinfo', {
        page,
        pageSize: this.state.pageSize,
        subsectID: this.props.subsectID,
      })
      .then(res => {
        this.setState({ isLoadingTable: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.studentList,
          isLoadingTable: false,
        });
      })
      .catch(err => {
        this.setState({ isLoadingTable: false, data: [] });
      });
  };

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
    const displayStudentData = [];
    for (const [index, value] of this.state.data.entries()) {
      displayStudentData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar
              imageURL={value.imageUrl == 'NA' ? getPlaceholder() : getImageUrl(value.imageUrl)}
            />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.email}</Table.Col>
          <Table.Col>{value.sectionName}</Table.Col>
          <Table.Col>{displayGradeLevel(value.gradeLevel)}</Table.Col>
        </Table.Row>,
      );
    }
    if (displayStudentData.length == 0) {
      displayStudentData.push(
        <Table.Row>
          <Table.Col colSpan={5} alignContent="center">
            No result.
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-teacher-view-subject-load-by-id my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col sm={12} lg={12}>
              <Card>
                <Card.Body>
                  {this.state.isLoading ? (
                    ''
                  ) : (
                    <Grid.Row>
                      <Grid.Col xs={12} sm={12} lg={6}>
                        <Card.Title>
                          <Breadcrumb>
                            <Breadcrumb.Item>Subjects</Breadcrumb.Item>
                            <Breadcrumb.Item>View Subject Load</Breadcrumb.Item>

                            <Breadcrumb.Item>
                              {this.state.sectionName} - {this.state.subjectName}
                            </Breadcrumb.Item>
                          </Breadcrumb>
                        </Card.Title>
                      </Grid.Col>
                      <Grid.Col xs={12} sm={12} lg={6}>
                        <Link to={`/managegrades/${this.props.subsectID}/Q1`}>
                          <Button.List align="right">
                            <Button style={{ margin: '20px' }} icon="file" color="primary">
                              Manage Grades
                            </Button>
                          </Button.List>
                        </Link>
                      </Grid.Col>
                    </Grid.Row>
                  )}
                  <Descriptions
                    style={{ marginBottom: '15px', marginTop: '15px' }}
                    bordered
                    title="Subject Load Information"
                  >
                    <Descriptions.Item span={3} label="Section Name">
                      {this.state.sectionName}
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Grade Level">
                      {displayGradeLevel(this.state.gradeLevel)}
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Subject Name">
                      {this.state.subjectName}
                    </Descriptions.Item>
                  </Descriptions>
                  <Grid.Row>
                    <Grid.Col xs={12} sm={12} md={12}>
                      <Spin spinning={this.state.isLoadingTable}>
                        <Table highlightRowOnHover={true} responsive={true}>
                          <Table.Header>
                            <Table.ColHeader alignContent="center" colSpan={2}>
                              Student Name
                            </Table.ColHeader>
                            <Table.ColHeader>Email</Table.ColHeader>
                            <Table.ColHeader>Section Name</Table.ColHeader>
                            <Table.ColHeader>Grade Level</Table.ColHeader>
                          </Table.Header>
                          <Table.Body>{displayStudentData}</Table.Body>
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
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
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
)(TeacherViewSubjectLoadById);
