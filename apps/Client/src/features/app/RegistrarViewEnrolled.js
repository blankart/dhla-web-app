import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import StudentTooltip from './StudentTooltip';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip } from 'antd';
import { Modal, Popconfirm, Search, Breadcrumb, AutoComplete, Input, message } from 'antd';
import placeholder from '../../images/placeholder.jpg';
import { getImageUrl, getPlaceholder } from '../../utils';
import { Table as AntdTable } from 'antd';
const { Option } = AutoComplete;

export class RegistrarViewEnrolled extends Component {
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
      options: [],
      page: 1,
      pageSize: 10,
      numOfPages: 1,
      keyword: '',
      selectedKey: -1,
      errors: {},
      studentID: 0,
      gradeLevel: '',
      sectionName: '',
      schoolYear: '',
      schoolYearID: 0,
      showModal: false,
      subsectList: [],
      selectedSubsect: [],
      selectedStudSectID: -1,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.enrollStudent = this.enrollStudent.bind(this);
    this.unenrollStudent = this.unenrollStudent.bind(this);
    this.studentAddSubject = this.studentAddSubject.bind(this);
  }

  enrollStudent() {
    if (this.state.selectedKey == -1) {
      message.error('You must select a student');
    } else {
      this.props.actions.createStudentSection(
        {
          sectionID: this.props.id,
          schoolYearID: this.state.schoolYearID,
          studentID: this.state.selectedKey,
        },
        s => this.setState(s),
        this.state.subsectList,
      );
    }
  }

  studentAddSubject() {
    if (this.state.selectedSubsect.length == 0) {
      message.error('You must select a student');
    } else {
      this.props.actions.addSubjectSectionStudentBulk({
        studsectID: this.state.selectedStudSectID,
        subsectIDs: this.state.selectedSubsect,
      });
      this.setState({ showModal: false });
    }
  }

  unenrollStudent() {
    this.props.actions.deleteStudentSection({
      sectionID: this.props.id,
      schoolYearID: this.state.schoolYearID,
      studentID: this.state.studentID,
    });
  }

  componentWillReceiveProps() {
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/getcurrentenrolled', { sectionID: this.props.id, page: 1, pageSize: 10 })
      .then(res => {
        this.setState({ numOfPages: res.data.numOfPages, data: res.data.studentList });
        this.setState({ isLoadingTable: false });
      })
      .catch(err => {
        this.setState({ data: [] });
        this.setState({ isLoadingTable: false });
      });
  }

  componentDidMount() {
    axios.get('api/registrar/getsy').then(res => {
      axios.post('api/registrar/sectionname', { sectionID: this.props.id }).then(res2 => {
        this.setState({ sectionName: res2.data.sectionName });
        this.setState({ schoolYearID: res.data.schoolYearID });
        this.setState({ schoolYear: res.data.schoolYear });
        this.setState({ isLoading: false });
        axios
          .post('api/registrar/getcurrentenrolled', {
            sectionID: this.props.id,
            page: 1,
            pageSize: this.state.pageSize,
          })
          .then(res3 => {
            axios
              .post('api/registrar/listsubjectsection', { sectionID: this.props.id })
              .then(res4 => {
                this.setState({ gradeLevel: res3.data.gradeLevel });
                this.setState({ numOfPages: res3.data.numOfPages });
                this.setState({ data: res3.data.studentList });
                this.setState({ isLoadingTable: false });
                this.setState({ subsectList: res4.data.subjectList });
              });
          })
          .catch(err => {
            this.setState({ isLoadingTable: false });
          });
      });
    });
  }

  paginate = page => {
    this.setState({
      page,
    });
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/getcurrentenrolled', {
        page,
        pageSize: this.state.pageSize,
        sectionID: this.props.id,
      })
      .then(res => {
        this.setState({ isLoadingTable: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.studentList,
        });
      })
      .catch(err => {
        this.setState({ isLoadingTable: false });
      });
  };

  handleSearch(query) {
    this.setState({ selectedKey: -1 });
    this.setState({
      options: [
        <Option key={0} text="">
          <div>
            <Spin spinning={true}></Spin>
          </div>
        </Option>,
      ],
    });
    axios
      .post('api/registrar/searchstudent', { keyword: query })
      .then(res => {
        if (query == '') {
          this.setState({ options: [] });
        } else {
          let optionData = res.data.accountList.map(data => (
            <Option key={data.key} text={data.name}>
              <div>
                <Avatar
                  imageURL={data.imageUrl == 'NA' ? getPlaceholder() : getImageUrl(data.imageUrl)}
                />
                <span style={{ margin: '16px', verticalAlign: 'text-top' }}>{data.name}</span>
              </div>
            </Option>
          ));
          this.setState({ options: optionData });
        }
      })
      .catch(err => {
        this.setState({
          options: [
            <Option key={0} text="">
              <div>No data.</div>
            </Option>,
          ],
        });
      });
  }

  onSelect(key) {
    this.setState({ selectedKey: key });
  }

  render() {
    const { options } = this.state;
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar
              imageURL={value.imageUrl == 'NA' ? getPlaceholder() : getImageUrl(value.imageUrl)}
            />
          </Table.Col>
          <Table.Col>
            <Tooltip title={<StudentTooltip id={value.key} />}>{value.name}</Tooltip>
          </Table.Col>
          <Table.Col>{value.email}</Table.Col>
          <Table.Col>
            <span style={{ marginLeft: '10px' }}>
              <Popconfirm
                title="Do you want to remove this student?"
                onConfirm={this.unenrollStudent}
                okText="Delete"
                cancelText="Cancel"
              >
                <Button
                  icon="trash"
                  size="sm"
                  pill
                  color="danger"
                  value={value.key}
                  onClick={() => {
                    this.setState({ studentID: value.key });
                  }}
                />
              </Popconfirm>
            </span>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <div className="app-registrar-view-enrolled my-3 my-md-5 card">
        <Modal
          title="Enroll to subjects"
          visible={this.state.showModal}
          onOk={this.studentAddSubject}
          onCancel={() =>
            this.setState({ showModal: false, selectedSubsect: [], selectedStudSectID: -1 })
          }
          okText="Enroll student"
          confirmLoading={this.props.app.showLoading}
          cancelText="Close"
        >
          <Container>
            <Grid.Row>
              <Grid.Col sm={12} xs={12} md={12}>
                Do you want to enroll this student to the following subjects?
              </Grid.Col>
              <Grid.Col sm={12} xs={12} md={12}>
                <AntdTable
                  columns={[
                    {
                      title: 'Subject',
                      dataIndex: 'subjectName',
                      render: text => text,
                    },
                    {
                      title: 'Teacher',
                      dataIndex: 'teacher',
                      render: text => text,
                    },
                  ]}
                  rowSelection={{
                    onChange: (selectedRowKeys, selectedRows) => {
                      this.setState({ selectedSubsect: selectedRows });
                    },
                  }}
                  dataSource={this.state.subsectList}
                />
              </Grid.Col>
            </Grid.Row>
          </Container>
        </Modal>
        <Card.Body>
          {this.state.isLoading ? (
            ''
          ) : (
            <div>
              {' '}
              <Card.Title>
                <Breadcrumb>
                  <Breadcrumb.Item>Sections</Breadcrumb.Item>
                  <Breadcrumb.Item>Manage Students</Breadcrumb.Item>
                  <Breadcrumb.Item>{this.state.sectionName}</Breadcrumb.Item>
                </Breadcrumb>
              </Card.Title>
              <Card.Title>
                {this.state.sectionName} S.Y. {this.state.schoolYear}
              </Card.Title>
            </div>
          )}
          <Grid.Row>
            <Grid.Col sm={12} md={12} xs={12}>
              <Grid.Row>
                <Grid.Col sm={12} md={6} xs={12}>
                  <AutoComplete
                    style={{ width: '100%', marginBottom: '10px' }}
                    onSearch={this.handleSearch}
                    dataSource={options}
                    onSelect={this.onSelect}
                    optionLabelProp="text"
                  >
                    <Input placeholder="Search for students" enterButton />
                  </AutoComplete>
                </Grid.Col>
                <Grid.Col sm={6} md={3} xs={6}>
                  <Button color="primary" block onClick={this.enrollStudent}>
                    Add to Section
                  </Button>
                </Grid.Col>
                <Grid.Col sm={6} md={3} xs={6}>
                  <Link to={`/managestudents/viewpastrecords/${this.props.id}`}>
                    <Button
                      icon="user"
                      disabled={this.state.gradeLevel == 'N'}
                      color="primary"
                      block
                    >
                      View past records
                    </Button>
                  </Link>
                </Grid.Col>
              </Grid.Row>
              <Spin spinning={this.state.isLoadingTable}>
                <Table highlightRowOnHover={true} responsive={true}>
                  <Table.Header>
                    <Table.ColHeader colSpan={2}>Student Name</Table.ColHeader>
                    <Table.ColHeader>Email address</Table.ColHeader>
                    <Table.ColHeader>Action</Table.ColHeader>
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
)(RegistrarViewEnrolled);
