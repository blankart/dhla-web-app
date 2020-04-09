import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
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
  Popover,
} from 'antd';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import {
  Card,
  Button,
  Grid,
  Avatar,
  Table,
  Form,
  Header,
  Container,
  Text,
  Alert,
} from 'tabler-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils';

const { Option } = AutoComplete;

export class TeacherComponent extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      componentID: 0,
      component: '',
      grades: [],
      ave: [],
      isLoading: true,
      quarter: 'Q1',
      sectionName: '',
      subjectName: '',
      schoolYear: '',
      subjectCode: '',
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .post('api/teacher/getcomponents', {
        subsectID: this.props.subsectID,
        quarter: this.props.quarter,
      })
      .then(res => {
        this.setState({
          sectionName: res.data.sectionName,
          subjectName: res.data.subjectName,
          schoolYear: res.data.schoolYear,
          subjectCode: res.data.subjectCode,
        });
        axios
          .post('api/teacher/compinfo', {
            subsectID: this.props.subsectID,
            componentID: this.props.componentID,
            quarter: this.props.quarter,
          })
          .then(res2 => {
            this.setState({
              isLoading: false,
              componentID: this.props.componentID,
              component: res2.data.component,
              grades: res2.data.grades,
              ave: res2.data.ave,
              quarter: this.props.quarter,
            });
          });
      });
  }

  render() {
    let headerData = [];
    let tableData = [];
    headerData.push(<Table.ColHeader colSpan={2}>Student Name</Table.ColHeader>);
    if (!this.state.isLoading) {
      for (const [index, value] of this.state.grades.entries()) {
        headerData.push(
          <Table.ColHeader alignContent="center">
            {value.name}
            <span style={{ marginLeft: '5px' }}>
              <Button outline size="sm" color="primary">
                <Link
                  to={`/managegrades/${this.props.subsectID}/${this.props.quarter}/${this.props.componentID}/subcomp/${value.subcompID}`}
                >
                  View
                </Link>
              </Button>
            </span>
          </Table.ColHeader>,
        );
      }
      headerData.push(<Table.ColHeader alignContent="center">Percentage Score</Table.ColHeader>);
      for (const [index, value] of this.state.grades[0].data.entries()) {
        let name = value.name;
        let imageUrl = value.imageUrl;
        let subsectstudID = value.subsectstudID;
        let tempRow = [];
        for (const [index, value] of this.state.grades.entries()) {
          let ps = value.data.find(value => value.subsectstudID == subsectstudID).ps;
          tempRow.push(
            <Table.Col alignContent="center">
              {ps == -1 ? 'Not yet available' : Number(Math.round(ps + 'e2') + 'e-2')}
            </Table.Col>,
          );
        }
        let ave = this.state.ave.find(value => value.subsectstudID == subsectstudID).ws;
        tempRow.push(
          <Table.Col alignContent="center">
            {ave == -1 ? 'Not yet available' : Number(Math.round(ave + 'e2') + 'e-2')}
          </Table.Col>,
        );
        tableData.push(
          <Table.Row>
            <Table.Col className="w-1">
              <Avatar imageURL={imageUrl == 'NA' ? placeholder : getImageUrl(imageUrl)} />
            </Table.Col>
            <Table.Col>{name}</Table.Col>
            {tempRow}
          </Table.Row>,
        );
      }
    }

    return (
      <div className="app-teacher-component my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Card>
              <Card.Body>
                {this.state.isLoading ? (
                  <Spin spinning={true}></Spin>
                ) : (
                  <div>
                    <Card.Title>
                      <Breadcrumb>
                        <Breadcrumb.Item>Subjects</Breadcrumb.Item>
                        <Breadcrumb.Item>View Subject Load</Breadcrumb.Item>
                        <Breadcrumb.Item>Manage Grades</Breadcrumb.Item>
                        <Breadcrumb.Item>
                          {this.state.sectionName} - {this.state.subjectName}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.component}</Breadcrumb.Item>
                      </Breadcrumb>
                    </Card.Title>
                    <Card.Title>
                      <Header.H3>{this.state.component}</Header.H3>
                    </Card.Title>
                    <Card.Title>
                      <Text.Small>
                        {this.state.sectionName} {this.props.quarter} S.Y. {this.state.schoolYear}
                      </Text.Small>
                    </Card.Title>
                  </div>
                )}
              </Card.Body>
              {this.state.isLoading ? (
                <Spin spinning={true}></Spin>
              ) : (
                <Card.Body>
                  <Grid.Row>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Descriptions
                        style={{ marginBottom: '15px', marginTop: '15px' }}
                        bordered
                        title="Subject Load Information"
                      >
                        <Descriptions.Item span={3} label="Section Name">
                          {this.state.sectionName}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Subject Name">
                          {this.state.subjectName}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Number of Students">
                          {tableData.length}
                        </Descriptions.Item>
                      </Descriptions>
                    </Grid.Col>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Table highlightRowOnHover={true} responsive={true}>
                        <Table.Header>{headerData}</Table.Header>
                        <Table.Body>{tableData}</Table.Body>
                      </Table>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Body>
              )}
            </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(TeacherComponent);
