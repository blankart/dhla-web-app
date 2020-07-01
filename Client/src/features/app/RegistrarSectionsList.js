import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin } from 'antd';
import { Modal, Popconfirm, Breadcrumb } from 'antd';

export class RegistrarSectionsList extends Component {
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
      numOfPages: 1,
      data: [],
      showAddSection: false,
      addSectionLoading: false,
      errors: {},
      sectionName: '',
      gradeLevel: 'N',
      showEditSection: false,
      editSectionLoading: false,
      selectedKey: 0,
    };

    this.showAddSection = this.showAddSection.bind(this);
    this.hideAddSection = this.hideAddSection.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.addSection = this.addSection.bind(this);
    this.hideEditSection = this.hideEditSection.bind(this);
    this.editSection = this.editSection.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
  }

  showEditSection(key) {
    this.setState({
      showEditSection: true,
      sectionName: this.state.data.filter(section => section.key === key)[0].name,
      gradeLevel: this.state.data.filter(section => section.key === key)[0].gradeLevel,
      selectedKey: key,
      errors: {},
    });
  }

  editSection() {
    this.props.actions.editSection({
      sectionID: this.state.selectedKey,
      sectionName: this.state.sectionName,
      gradeLevel: this.state.gradeLevel,
    });
  }

  hideEditSection() {
    this.setState({
      showEditSection: false,
      editSectionLoading: false,
      sectionName: '',
      gradeLevel: 'N',
      errors: {},
    });
  }

  deleteSection() {
    this.props.actions.deleteSection({ sectionID: this.state.selectedKey });
  }

  showAddSection() {
    this.setState({
      showAddSection: true,
      sectionName: '',
      gradeLevel: 'N',
      errors: {},
    });
  }

  hideAddSection() {
    this.setState({ showAddSection: false, sectionName: '', gradeLevel: 'N', errors: {} });
    this.props.actions.getErrors({});
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onChangeSearch(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ isLoading: true, page: 1 });
    axios
      .post('api/registrar/getsections', {
        keyword: event.target.value,
        page: 1,
        pageSize: this.state.pageSize,
      })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({ numOfPages: res.data.numOfPages, data: res.data.sectionList });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        this.setState({ data: [] });
      });
  }

  addSection() {
    this.props.actions.addSection({
      sectionName: this.state.sectionName,
      gradeLevel: this.state.gradeLevel,
    });
  }

  paginate = page => {
    this.setState({
      page,
    });
    this.setState({ isLoading: true });
    axios
      .post('api/registrar/getsections', {
        keyword: this.state.keyword,
        page,
        pageSize: this.state.pageSize,
      })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({
          numOfPages: res.data.numOfPages,
          data: res.data.sectionList,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    axios
      .post('api/registrar/getsections', { keyword: '', page: 1, pageSize: 10 })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({ numOfPages: res.data.numOfPages, data: res.data.sectionList });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  componentWillReceiveProps() {
    this.setState({ isLoading: true });
    axios
      .post('api/registrar/getsections', {
        keyword: this.state.keyword,
        page: this.state.page,
        pageSize: 10,
      })
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({ numOfPages: res.data.numOfPages, data: res.data.sectionList });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        this.setState({ data: [] });
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
    const { errors } = this.props.app;
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col>{value.name}</Table.Col>
          <Table.Col>{displayGradeLevel(value.gradeLevel)}</Table.Col>
          <Table.Col>
            <Button
              icon="edit"
              size="sm"
              pill
              color="primary"
              value={value.key}
              onClick={() => this.showEditSection(value.key)}
            />
            <span style={{ marginLeft: '10px' }}>
              <Popconfirm
                title="Do you want to delete this section?"
                onConfirm={this.deleteSection}
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
                    this.setState({ selectedKey: value.key });
                  }}
                />
              </Popconfirm>
            </span>
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <Table.Body className="app-registrar-add-section my-3 my-md-5 card">
        <Modal
          title="Edit Section"
          visible={this.state.showEditSection}
          onOk={this.editSection}
          onCancel={this.hideEditSection}
          okText="Edit section"
          confirmLoading={this.props.app.showLoading}
          cancelText="Close"
        >
          <Spin spinning={this.props.app.showLoading}>
            <Container>
              <Grid.Row>
                <Grid.Col sm={12} md={12}>
                  <Form.Group>
                    <Form.Label>Section Name</Form.Label>
                    <Form.Input
                      type="text"
                      name="sectionName"
                      placeholder="Section Name"
                      value={this.state.sectionName}
                      error={errors.sectionName}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Grid.Col>
                <Grid.Col sm={12} md={12}>
                  <Form.Group>
                    <Form.Label>Grade Level</Form.Label>
                    <Form.Select
                      value={this.state.gradeLevel}
                      onChange={this.onChange}
                      name="gradeLevel"
                    >
                      <option value="N">Nursery</option>
                      <option value="K1">Kinder 1</option>
                      <option value="K2">Kinder 2</option>
                      <option value="G1">Grade 1</option>
                      <option value="G2">Grade 2</option>
                      <option value="G3">Grade 3</option>
                      <option value="G4">Grade 4</option>
                      <option value="G5">Grade 5</option>
                      <option value="G6">Grade 6</option>
                      <option value="G7">Grade 7</option>
                      <option value="G8">Grade 8</option>
                      <option value="G9">Grade 9</option>
                      <option value="G10">Grade 10</option>
                      <option value="G11">Grade 11</option>
                      <option value="G12">Grade 12</option>
                    </Form.Select>
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
            </Container>
          </Spin>
        </Modal>
        <Modal
          title="Add a Section"
          visible={this.state.showAddSection}
          onOk={this.addSection}
          onCancel={this.hideAddSection}
          okText="Add section"
          confirmLoading={this.props.app.showLoading}
          cancelText="Close"
        >
          <Spin spinning={this.props.app.showLoading}>
            <Container>
              <Grid.Row>
                <Grid.Col sm={12} md={12}>
                  <Form.Group>
                    <Form.Label>Section Name</Form.Label>
                    <Form.Input
                      type="text"
                      name="sectionName"
                      placeholder="Section Name"
                      value={this.state.sectionName}
                      error={errors.sectionName}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Grid.Col>
                <Grid.Col sm={12} md={12}>
                  <Form.Group>
                    <Form.Label>Grade Level</Form.Label>
                    <Form.Select
                      value={this.state.gradeLevel}
                      onChange={this.onChange}
                      name="gradeLevel"
                    >
                      <option value="N">Nursery</option>
                      <option value="K1">Kinder 1</option>
                      <option value="K2">Kinder 2</option>
                      <option value="G1">Grade 1</option>
                      <option value="G2">Grade 2</option>
                      <option value="G3">Grade 3</option>
                      <option value="G4">Grade 4</option>
                      <option value="G5">Grade 5</option>
                      <option value="G6">Grade 6</option>
                      <option value="G7">Grade 7</option>
                      <option value="G8">Grade 8</option>
                      <option value="G9">Grade 9</option>
                      <option value="G10">Grade 10</option>
                      <option value="G11">Grade 11</option>
                      <option value="G12">Grade 12</option>
                    </Form.Select>
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
            </Container>
          </Spin>
        </Modal>
        <Card.Body>
          <Card.Title>
            <Breadcrumb>
              <Breadcrumb.Item>Sections</Breadcrumb.Item>
              <Breadcrumb.Item>Sections List</Breadcrumb.Item>
            </Breadcrumb>
          </Card.Title>
          <Card.Title>Sections List</Card.Title>
          <Grid.Row>
            <Grid.Col sm={12} md={12} xs={12}>
              <Grid.Row>
                <Grid.Col sm={12} md={10} xs={12}>
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
                <Grid.Col sm={12} md={2} xs={12}>
                  <Button icon="plus" block color="primary" onClick={this.showAddSection}>
                    Add Section
                  </Button>
                </Grid.Col>
              </Grid.Row>
              <Spin spinning={this.state.isLoading}>
                <Table highlightRowOnHover={true} responsive={true}>
                  <Table.Header>
                    <Table.ColHeader>Section Name</Table.ColHeader>
                    <Table.ColHeader>Grade Level</Table.ColHeader>
                    <Table.ColHeader>Action</Table.ColHeader>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarSectionsList);
