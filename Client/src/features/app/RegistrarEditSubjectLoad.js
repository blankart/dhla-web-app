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
import bg from '../../images/BG.png';
import { getImageUrl } from '../../utils';
const { Option } = AutoComplete;

function ProfileImage({ avatarURL }) {
  return <img className="card-profile-img" alt="Profile" src={avatarURL} />;
}

function Profile({ className, children, name, avatarURL = '', backgroundURL = '', bio }) {
  const classes = cn('card-profile', className);
  return (
    <Card className={classes}>
      <Card.Header backgroundURL={backgroundURL} />
      <Card.Body className="text-center">
        <ProfileImage avatarURL={avatarURL} />
        <Header.H3 className="mb-3">{name}</Header.H3>
        <p className="mb-4">{bio || children}</p>
      </Card.Body>
    </Card>
  );
}

export class RegistrarEditSubjectLoad extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingTable: true,
      name: '',
      email: '',
      accountID: '',
      imageUrl: '',
      data: [],
      gradeLevel: 'N',
      sectionName: '',
      subjectName: '',
      selectedKey: -1,
      options: [],
      optionLoading: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.addStudent = this.addStudent.bind(this);
  }

  addStudent() {
    this.props.actions.addSubjectSectionStudent({
      studsectID: this.state.selectedKey,
      subsectID: this.props.subsectID,
    });
  }

  deleteStudent(key) {
    this.props.actions.deleteSubjectSectionStudent({ subsectstudID: key });
  }

  onSelect(key) {
    this.setState({ selectedKey: key });
  }

  handleSearch(query) {
    this.setState({ selectedKey: -1 });
    this.setState({
      options: [],
      optionLoading: true,
    });
    axios
      .post('api/registrar/searchenrolled', { keyword: query })
      .then(res => {
        if (query == '') {
          this.setState({ options: [], optionLoading: false });
        } else {
          this.setState({ options: res.data.studentList, optionLoading: false });
        }
      })
      .catch(err => {
        this.setState({
          options: [],
          optionLoading: false,
        });
      });
  }

  componentDidMount() {
    axios.post('api/registrar/userinfo', { accountID: this.props.accountID }).then(res => {
      this.setState({
        email: res.data.email,
        imageUrl: res.data.imageUrl,
        name: res.data.name,
      });
      axios.post('api/registrar/getsubsectinfo', { subsectID: this.props.subsectID }).then(res2 => {
        this.setState({
          isLoading: false,
          isLoadingTable: false,
          data: res2.data.studentList,
          gradeLevel: res2.data.gradeLevel,
          sectionName: res2.data.sectionName,
          subjectName: res2.data.subjectName,
        });
      });
    });
  }

  componentWillReceiveProps() {
    this.setState({ isLoadingTable: true });
    axios.post('api/registrar/getsubsectinfo', { subsectID: this.props.subsectID }).then(res2 => {
      this.setState({
        isLoadingTable: false,
        data: res2.data.studentList,
        gradeLevel: res2.data.gradeLevel,
        sectionName: res2.data.sectionName,
        subjectName: res2.data.subjectName,
      });
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
    let displayOptions = [];
    const displayStudentData = [];
    for (const [index, value] of this.state.options.entries()) {
      displayOptions.push(
        <Option key={value.studsectID} text={value.name}>
          <div>
            <Avatar imageURL={value.imageUrl == 'NA' ? placeholder : getImageUrl(value.imageUrl)} />
            <span style={{ margin: '16px', verticalAlign: 'text-top' }}>{value.name}</span>
          </div>
        </Option>,
      );
    }
    for (const [index, value] of this.state.data.entries()) {
      displayStudentData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar imageURL={value.imageUrl == 'NA' ? placeholder : getImageUrl(value.imageUrl)} />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{value.email}</Table.Col>
          <Table.Col>{value.sectionName}</Table.Col>
          <Table.Col>{displayGradeLevel(value.gradeLevel)}</Table.Col>
          <Table.Col alignContent="center">
            <Popconfirm
              title="Do you want to remove this subject load?"
              onConfirm={() => this.deleteStudent(value.key)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button pill size="sm" icon="trash" color="danger"></Button>
            </Popconfirm>
          </Table.Col>
        </Table.Row>,
      );
    }
    if (displayStudentData.length == 0) {
      displayStudentData.push(
        <Table.Row>
          <Table.Col colSpan={6} alignContent="center">
            No result.
          </Table.Col>
        </Table.Row>,
      );
    }
    if (this.state.optionLoading) {
      displayOptions = [
        <Option key={0} text="">
          <div>
            <Spin spinning={true}></Spin>
          </div>
        </Option>,
      ];
    } else {
      if (displayOptions.length == 0) {
        displayOptions = [
          <Option key={0} text="">
            <div>No data.</div>
          </Option>,
        ];
      }
    }
    return (
      <div className="app-registrar-edit-subject-load my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col sm={12} lg={4}>
              {this.state.isLoading ? (
                <Spin spinning={this.state.isLoading}>
                  <Profile name="" avatarURL={placeholder} backgroundURL={bg}></Profile>
                </Spin>
              ) : (
                <Profile
                  name={this.state.name}
                  avatarURL={
                    this.state.imageUrl === 'NA' ? placeholder : getImageUrl(this.state.imageUrl)
                  }
                  backgroundURL={bg}
                ></Profile>
              )}
            </Grid.Col>
            <Grid.Col sm={12} lg={8}>
              <Card>
                <Card.Body>
                  {this.state.isLoading ? (
                    ''
                  ) : (
                    <div>
                      <Card.Title>
                        <Breadcrumb>
                          <Breadcrumb.Item>Teachers</Breadcrumb.Item>
                          <Breadcrumb.Item>Assign Subject Load</Breadcrumb.Item>

                          <Breadcrumb.Item>{this.state.name}</Breadcrumb.Item>
                          <Breadcrumb.Item>Edit</Breadcrumb.Item>
                          <Breadcrumb.Item>{this.state.subjectName}</Breadcrumb.Item>
                        </Breadcrumb>
                      </Card.Title>
                    </div>
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
                    <Descriptions.Item span={3} label="Teacher">
                      {this.state.name}
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Number of Students">
                      {this.state.data.length}
                    </Descriptions.Item>
                  </Descriptions>
                  <Grid.Row>
                    <Grid.Col sm={12} xs={12} md={10}>
                      <AutoComplete
                        style={{ width: '100%', marginBottom: '10px' }}
                        optionLabelProp="text"
                        onSearch={this.handleSearch}
                        dataSource={displayOptions}
                        onSelect={this.onSelect}
                      >
                        <Input placeholder="Search for students" enterButton />
                      </AutoComplete>
                    </Grid.Col>
                    <Grid.Col sm={12} xs={12} md={2}>
                      <Button
                        block
                        icon="plus"
                        color="primary"
                        onClick={() => this.addStudent()}
                        disabled={this.state.selectedKey == -1}
                      >
                        Add
                      </Button>
                    </Grid.Col>
                  </Grid.Row>
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
                            <Table.ColHeader alignContent="center">Actions</Table.ColHeader>
                          </Table.Header>
                          <Table.Body>{displayStudentData}</Table.Body>
                        </Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarEditSubjectLoad);
