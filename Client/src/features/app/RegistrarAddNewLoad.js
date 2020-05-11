import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip } from 'antd';
import {
  Modal,
  Popconfirm,
  Select,
  Search,
  Breadcrumb,
  AutoComplete,
  Input,
  message,
  Descriptions,
} from 'antd';
import { getImageUrl, getPlaceholder } from '../../utils';
const { Option } = Select;

export class RegistrarAddNewLoad extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoadingTable: false,
      isLoading: true,
      sectionOption: [],
      isSectionLoading: true,
      subjectOption: [],
      isSubjectLoading: true,
      gradeLevel: 'N',
      noSectionData: true,
      noSubjectData: true,
      selectedSubject: 0,
      selectedSection: 0,
      sectionName: 'NA',
      subjectName: 'NA',
      studentData: [],
      page: 1,
      pageSize: 100,
      keyword: '',
      selectedKey: -1,
      options: [],
      optionLoading: false,
    };

    this.onChangeGradeLevel = this.onChangeGradeLevel.bind(this);
    this.onChangeSection = this.onChangeSection.bind(this);
    this.onChangeSubject = this.onChangeSubject.bind(this);
    this.importStudent = this.importStudent.bind(this);
    this.removeStudent = this.removeStudent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.addStudent = this.addStudent.bind(this);
  }

  addStudent() {
    let arr = this.state.studentData;
    let add = this.state.options.find(value => value.key == this.state.selectedKey);
    if (arr.findIndex(val => val.key == this.state.selectedKey) == -1) {
      arr.push(add);
      this.setState({ studentData: arr });
    } else {
      message.error('Student already in the list');
    }
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

  removeStudent(key) {
    const index = this.state.studentData.findIndex(value => value.key == key);
    if (index != -1) {
      let arr = this.state.studentData;
      arr.splice(index, 1);
      this.setState({ studentData: arr });
    }
  }

  importStudent() {
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/getcurrentenrolled', {
        page: this.state.page,
        pageSize: this.state.pageSize,
        sectionID: this.state.selectedSection,
      })
      .then(res => {
        this.setState({ isLoadingTable: false, studentData: res.data.studentList });
      })
      .catch(err => {
        this.setState({ isLoadingTable: false, studentData: [] });
      });
  }

  onChangeSection(value) {
    this.setState({ selectedSection: value });
    const sectionName =
      this.state.sectionOption.length != 0
        ? this.state.sectionOption.find(val => val.sectionID == value).sectionName
        : '';
    this.setState({ sectionName });
  }

  onChangeSubject(value) {
    this.setState({ selectedSubject: value });
    const subjectName =
      this.state.subjectOption.length != 0
        ? this.state.subjectOption.find(val => val.subjectID == value).subjectName
        : '';
    this.setState({ subjectName });
  }

  onChangeGradeLevel(value) {
    this.setState({ studentData: [] });
    this.setState({ gradeLevel: value });
    this.setState({ isSubjectLoading: true, isSectionLoading: true });
    axios
      .post('api/registrar/getsubjectbygradelevel', { gradeLevel: value })
      .then(res => {
        this.setState({ isSubjectLoading: false });
        this.setState({ subjectOption: res.data.subjectsList });
        this.setState({ noSubjectData: false });
        this.setState({ selectedSubject: res.data.subjectsList[0].subjectID });
        this.setState({ subjectName: res.data.subjectsList[0].subjectName });
      })
      .catch(err => {
        this.setState({ subjectOption: [] });
        this.setState({ isSubjectLoading: false });
        this.setState({ noSubjectData: true });
        this.setState({ selectedSubject: 0 });
        this.setState({ subjectName: 'NA' });
      });
    axios
      .post('api/registrar/getsectionbygradelevel', { gradeLevel: value })
      .then(res => {
        this.setState({ isSectionLoading: false });
        this.setState({ sectionOption: res.data.sectionsList });
        this.setState({ noSectionData: false });
        this.setState({ selectedSection: res.data.sectionsList[0].sectionID });
        this.setState({ sectionName: res.data.sectionsList[0].sectionName });
      })
      .catch(err => {
        this.setState({ isSectionLoading: false });
        this.setState({ sectionOption: [] });
        this.setState({ noSectionData: true });
        this.setState({ selectedSection: 0 });
        this.setState({ sectionName: 'NA' });
      });
  }

  componentDidMount() {
    axios
      .post('api/registrar/getsubjectbygradelevel', { gradeLevel: this.state.gradeLevel })
      .then(res => {
        this.setState({ isSubjectLoading: false });
        this.setState({ subjectOption: res.data.subjectsList });
        this.setState({ noSubjectData: false });
        this.setState({ selectedSubject: res.data.subjectsList[0].subjectID });
        this.setState({ subjectName: res.data.subjectsList[0].subjectName });
      })
      .catch(err => {
        this.setState({ subjectOption: [] });
        this.setState({ isSubjectLoading: false });
        this.setState({ noSubjectData: true });
        this.setState({ selectedSubject: 0 });
        this.setState({ subjectName: 'NA' });
      });
    axios
      .post('api/registrar/getsectionbygradelevel', { gradeLevel: this.state.gradeLevel })
      .then(res => {
        this.setState({ isSectionLoading: false });
        this.setState({ sectionOption: res.data.sectionsList });
        this.setState({ noSectionData: false });
        this.setState({ selectedSection: res.data.sectionsList[0].sectionID });
        this.setState({ sectionName: res.data.sectionsList[0].sectionName });
      })
      .catch(err => {
        this.setState({ isSectionLoading: false });
        this.setState({ sectionOption: [] });
        this.setState({ noSectionData: true });
        this.setState({ selectedSection: 0 });
        this.setState({ sectionName: 'NA' });
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
    const displaySubjectOption = [];
    const displaySectionOption = [];
    for (const [index, value] of this.state.subjectOption.entries()) {
      displaySubjectOption.push(<Option value={value.subjectID}>{value.subjectCode}</Option>);
    }
    for (const [index, value] of this.state.sectionOption.entries()) {
      displaySectionOption.push(<Option value={value.sectionID}>{value.sectionName}</Option>);
    }
    for (const [index, value] of this.state.options.entries()) {
      displayOptions.push(
        <Option key={value.key} text={value.name}>
          <div>
            <Avatar
              imageURL={value.imageUrl == 'NA' ? getPlaceholder() : getImageUrl(value.imageUrl)}
            />
            <span style={{ margin: '16px', verticalAlign: 'text-top' }}>{value.name}</span>
          </div>
        </Option>,
      );
    }
    for (const [index, value] of this.state.studentData.entries()) {
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
          <Table.Col alignContent="center">
            <Button
              pill
              icon="trash"
              color="danger"
              onClick={() => this.removeStudent(value.key)}
            ></Button>
          </Table.Col>
        </Table.Row>,
      );
    }
    if (displaySubjectOption.length == 0) {
      displaySubjectOption.push(<Option value={0}>No records.</Option>);
    }
    if (displaySectionOption.length == 0) {
      displaySectionOption.push(<Option value={0}>No records.</Option>);
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
      <Table className="app-registrar-add-new-load card">
        <Card.Body>
          <Card.Title>Add a New Subject Load</Card.Title>
          <Container>
            <Grid.Row>
              <Grid.Col sm={12} lg={2}>
                <Form.Group>
                  <Form.Label>Grade Level</Form.Label>
                  <Input.Group>
                    <Select
                      style={{ width: '100%' }}
                      defaultValue={this.state.gradeLevel}
                      onChange={this.onChangeGradeLevel}
                    >
                      <Option value="N">Nursery</Option>
                      <Option value="K1">Kinder 1</Option>
                      <Option value="K2">Kinder 2</Option>
                      <Option value="G1">Grade 1</Option>
                      <Option value="G2">Grade 2</Option>
                      <Option value="G3">Grade 3</Option>
                      <Option value="G4">Grade 4</Option>
                      <Option value="G5">Grade 5</Option>
                      <Option value="G6">Grade 6</Option>
                      <Option value="G7">Grade 7</Option>
                      <Option value="G8">Grade 8</Option>
                      <Option value="G9">Grade 9</Option>
                      <Option value="G10">Grade 10</Option>
                      <Option value="G11">Grade 11</Option>
                      <Option value="G12">Grade 12</Option>
                    </Select>
                  </Input.Group>
                </Form.Group>
              </Grid.Col>
              <Grid.Col sm={12} lg={3}>
                <Form.Group>
                  <Form.Label>Section Name</Form.Label>
                  <Input.Group>
                    <Select
                      style={{ width: '100%' }}
                      defaultValue="0"
                      value={this.state.selectedSection}
                      loading={this.state.isSectionLoading}
                      disabled={this.state.noSectionData}
                      onChange={this.onChangeSection}
                    >
                      {displaySectionOption}
                    </Select>
                  </Input.Group>
                </Form.Group>
              </Grid.Col>
              <Grid.Col sm={12} lg={3}>
                <Form.Group>
                  <Form.Label>Subject Name</Form.Label>
                  <Input.Group>
                    <Select
                      style={{ width: '100%' }}
                      value={this.state.selectedSubject}
                      loading={this.state.isSubjectLoading}
                      disabled={this.state.noSubjectData}
                      onChange={this.onChangeSubject}
                    >
                      {displaySubjectOption}
                    </Select>
                  </Input.Group>
                </Form.Group>
              </Grid.Col>
              <Grid.Col sm={12} lg={4}>
                <Form.Label>Action</Form.Label>
                <Button
                  color="primary"
                  block
                  icon="plus"
                  onClick={this.importStudent}
                  disabled={this.state.noSectionData}
                >
                  Import Students
                </Button>
              </Grid.Col>
              <Grid.Col sm={12} xs={12} md={12}>
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
                  <Descriptions.Item span={3} label="Number of Students">
                    {this.state.studentData.length}
                  </Descriptions.Item>
                </Descriptions>
              </Grid.Col>
            </Grid.Row>
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
            <Grid.Row>
              <Button
                disabled={
                  this.state.studentData.length == 0 ||
                  this.state.selectedSection == 0 ||
                  this.state.selectedsubject == 0 ||
                  this.state.isLoadingTable ||
                  this.state.isSectionLoading ||
                  this.state.isSubjectLoading
                }
                icon="file"
                block
                color="primary"
                onClick={() => {
                  this.props.actions.createSubjectSection({
                    payload: this.state.studentData,
                    sectionID: this.state.selectedSection,
                    subjectID: this.state.selectedSubject,
                    accountID: this.props.accountID,
                  });
                }}
              >
                Create Subject Load
              </Button>
            </Grid.Row>
          </Container>
        </Card.Body>
      </Table>
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
)(RegistrarAddNewLoad);
