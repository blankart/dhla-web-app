import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Button, Grid, Table, Form, Container, Avatar } from 'tabler-react';
import { Pagination, Spin, Breadcrumb, Modal } from 'antd';
import axios from 'axios';
import { Popconfirm, Input, message, AutoComplete } from 'antd';
import { getImageUrl, getPlaceholder } from '../../utils';
import placeholder from '../../images/placeholder.jpg';
const { Option } = AutoComplete;

export class RegistrarAssignAdvisorySection extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingTable: true,
      keyword: '',
      page: 1,
      pageSize: 10,
      numOfPages: 1,
      data: [],
      schoolYearID: 0,
      schoolYear: '',
      assignAdivserLoading: false,
      showAssignAdviser: false,
      sectionName: '',
      selectedKey: -1,
      selectedSection: -1,
      teacherKeyword: '',
      options: [],
    };

    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.showAssignAdivser = this.showAssignAdivser.bind(this);
    this.hideAssignAdivser = this.hideAssignAdivser.bind(this);
    this.onTeacherChange = this.onTeacherChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.assignAdviser = this.assignAdviser.bind(this);
    this.unassignAdviser = this.unassignAdviser.bind(this);
  }

  assignAdviser() {
    if (this.state.selectedKey == -1) {
      message.error('You must select a teacher');
    } else {
      this.props.actions.assignAdvisorySection({
        schoolYearID: this.state.schoolYearID,
        teacherID: this.state.selectedKey,
        sectionID: this.state.selectedSection,
      });
    }
  }

  unassignAdviser() {
    this.props.actions.unassignAdvisorySection({
      schoolYearID: this.state.schoolYearID,
      teacherID: this.state.selectedKey,
      sectionID: this.state.selectedSection,
    });
  }

  onTeacherChange(query) {
    this.setState({ teacherKeyword: query });
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
      .post('api/registrar/searchteacher', { keyword: query })
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

  showAssignAdivser(key) {
    this.setState({
      showAssignAdviser: true,
      sectionName: this.state.data.filter(section => section.sectionID === key)[0].sectionName,
      selectedSection: key,
    });
  }

  hideAssignAdivser() {
    this.setState({ showAssignAdviser: false, selectedSection: -1 });
  }

  componentDidMount() {
    this.setState({ isLoading: true, isLoadingTable: true });
    axios.get('api/registrar/getsy').then(res => {
      this.setState({ schoolYearID: res.data.schoolYearID, schoolYear: res.data.schoolYear });
      this.setState({ isLoading: false });
      axios
        .post('api/registrar/advisorytable', {
          keyword: this.state.keyword,
          page: this.state.page,
          pageSize: this.state.pageSize,
        })
        .then(res2 => {
          this.setState({
            numOfPages: res2.data.numOfPages,
            data: res2.data.advisoryData,
            isLoadingTable: false,
          });
        })
        .catch(err => {
          this.setState({ isLoadingTable: false });
        });
    });
  }

  componentWillReceiveProps() {
    this.setState({ isLoading: true, isLoadingTable: true });
    axios.get('api/registrar/getsy').then(res => {
      this.setState({ schoolYearID: res.data.schoolYearID, schoolYear: res.data.schoolYear });
      this.setState({ isLoading: false });
      axios
        .post('api/registrar/advisorytable', {
          keyword: this.state.keyword,
          page: this.state.page,
          pageSize: this.state.pageSize,
        })
        .then(res2 => {
          this.setState({
            numOfPages: res2.data.numOfPages,
            data: res2.data.advisoryData,
            isLoadingTable: false,
          });
        })
        .catch(err => {
          this.setState({ isLoadingTable: false });
        });
    });
  }

  onChangeSearch(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ isLoadingTable: true, page: 1 });
    axios
      .post('api/registrar/advisorytable', {
        keyword: event.target.value,
        page: this.state.page,
        pageSize: this.state.pageSize,
      })
      .then(res2 => {
        this.setState({
          numOfPages: res2.data.numOfPages,
          data: res2.data.advisoryData,
          isLoadingTable: false,
        });
      })
      .catch(err => {
        this.setState({ isLoadingTable: false });
        this.setState({ data: [] });
      });
  }

  paginate = page => {
    this.setState({ page });
    this.setState({ isLoadingTable: true });
    axios
      .post('api/registrar/advisorytable', {
        keyword: this.state.keyword,
        page: page,
        pageSize: this.state.pageSize,
      })
      .then(res2 => {
        this.setState({
          numOfPages: res2.data.numOfPages,
          data: res2.data.advisoryData,
          isLoadingTable: false,
        });
      })
      .catch(err => {
        this.setState({ isLoadingTable: false });
        this.setState({ data: [] });
      });
  };

  onSelect(key) {
    this.setState({ selectedKey: key });
  }

  render() {
    const { options } = this.state;
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
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col>{value.sectionName}</Table.Col>
          <Table.Col>{displayGradeLevel(value.gradeLevel)}</Table.Col>
          <Table.Col>{value.adviser}</Table.Col>
          <Table.Col alignContent="center">
            {value.adviser === 'NO ADVISER' ? (
              <Button
                icon="plus"
                color="primary"
                value={value.sectionID}
                onClick={() => {
                  this.showAssignAdivser(value.sectionID);
                }}
              >
                Assign Adivser
              </Button>
            ) : (
              <Popconfirm
                title="Do you want to unassign this teacher?"
                onConfirm={this.unassignAdviser}
                okText="Unassign"
                cancelText="cancel"
              >
                <Button
                  icon="trash"
                  color="danger"
                  onClick={() => {
                    this.setState({
                      selectedSection: value.sectionID,
                      selectedKey: value.teacherID,
                    });
                  }}
                >
                  Unassign Adivser
                </Button>
              </Popconfirm>
            )}
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <Table.Body className="app-registrar-assign-advisory-section my-3 my-md-5 card">
        <Modal
          title="Assign Adivser"
          visible={this.state.showAssignAdviser}
          onOk={this.assignAdviser}
          onCancel={this.hideAssignAdivser}
          cancelText="close"
          okText="Assign Adivser"
        >
          <Spin spinning={this.props.app.showLoading}>
            <Container>
              <Grid.Row>
                <Grid.Col sm={12} md={12} xs={12}>
                  <AutoComplete
                    style={{ width: '100%', marginBottom: '10px' }}
                    onSearch={this.onTeacherChange}
                    dataSource={options}
                    onSelect={this.onSelect}
                    optionLabelProp="text"
                  >
                    <Input placeholder="Search for teachers" enterButton />
                  </AutoComplete>
                </Grid.Col>
              </Grid.Row>
            </Container>
          </Spin>
        </Modal>
        <Card.Body>
          {this.state.isLoading ? (
            ''
          ) : (
            <div>
              <Card.Title>
                <Breadcrumb>
                  <Breadcrumb.Item>Teachers</Breadcrumb.Item>
                  <Breadcrumb.Item>Assign Advisory Section</Breadcrumb.Item>
                </Breadcrumb>
              </Card.Title>
              <Card.Title>Advisory Table for S.Y. {this.state.schoolYear}</Card.Title>
            </div>
          )}
          <Grid.Row>
            <Grid.Col sm={12} md={12} xs={12}>
              <Grid.Row>
                <Grid.Col sm={12} md={12} xs={12}>
                  <Form.Group>
                    <Form.Input
                      icon="search"
                      placeholder="Search for..."
                      position="append"
                      name="keyword"
                      value={this.state.keyword}
                      onChange={this.onChangeSearch}
                    />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Spin spinning={this.state.isLoadingTable}>
                <Table highlightRowOnHover={true} responsive={true}>
                  <Table.Header>
                    <Table.ColHeader>Section Name</Table.ColHeader>
                    <Table.ColHeader>Grade Level</Table.ColHeader>
                    <Table.ColHeader>Adviser</Table.ColHeader>
                    <Table.ColHeader alignContent="center">Action</Table.ColHeader>
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
              </Spin>
            </Grid.Col>
          </Grid.Row>
        </Card.Body>
      </Table.Body>
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
)(RegistrarAssignAdvisorySection);
