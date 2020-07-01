import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Avatar, Table, Form, Header, Container, Text } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip, Descriptions } from 'antd';
import { Modal, Popconfirm, Search, Breadcrumb, AutoComplete, Input, message } from 'antd';
import cn from 'classnames';
import bg from '../../images/BG.png';
import { getImageUrl, getPlaceholder } from '../../utils';
const { Option } = AutoComplete;

export class AllStudentFinalGrades extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isLoading: false,
      data: [],
      finalGrade: -1,
    };
  }

  handleShowGrades = () => {
    this.setState({ isLoading: true }, () => {
      axios
        .post('api/registrar/studentfinalgrade', {
          studentID: this.props.id,
          schoolYearID: this.props.schoolYearID,
        })
        .then(res => {
          this.setState({
            data: res.data.data,
            finalGrade: res.data.finalGrade,
            isLoading: false,
          });
        });
    });
  };

  render() {
    const displayQuarter = quarter =>
      quarter == 'Q1'
        ? '1st Quarter'
        : quarter == 'Q2'
        ? '2nd Quarter'
        : quarter == 'Q3'
        ? '3rd Quarter'
        : '4th Quarter';
    const DisplayData = [];
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col alignContent={'center'}>{displayQuarter(value.quarter)}</Table.Col>
          <Table.Col alignContent={'center'}>
            {value.grade == -1 ? 'Not yet available' : value.grade}
          </Table.Col>
        </Table.Row>,
      );
    }
    return (
      <React.Fragment>
        <Modal
          title="Student Grades"
          onCancel={() => this.setState({ showModal: false })}
          footer={[<Button onClick={() => this.setState({ showModal: false })}>Close</Button>]}
          visible={this.state.showModal}
        >
          <Spin spinning={this.state.isLoading}>
            <Grid.Row>
              <Grid.Col sm={12} xs={12} md={12}>
                <Card statusColor={'success'}>
                  <Card.Body>
                    <Card.Title>Student Final Grade for S.Y. {this.props.schoolYear}</Card.Title>
                    <Table highlightRowOnHover={true} responsive={true}>
                      <Table.Header>
                        <Table.ColHeader alignContent={'center'}>Quarter</Table.ColHeader>
                        <Table.ColHeader alignContent={'center'}>Grade</Table.ColHeader>
                      </Table.Header>
                      <Table.Body>
                        {DisplayData.length == 0 ? (
                          <Table.Row>
                            <Table.Col colSpan={2} alignContent={'center'}>
                              No entries.
                            </Table.Col>
                          </Table.Row>
                        ) : (
                          DisplayData
                        )}
                      </Table.Body>
                    </Table>
                  </Card.Body>
                  <Card.Footer>
                    <Text style={{ fontSize: '18px' }}>
                      Final Grade for S.Y. {this.props.schoolYear}:{' '}
                      <b>
                        {this.state.finalGrade == -1 ? 'Not yet available' : this.state.finalGrade}
                      </b>
                    </Text>
                  </Card.Footer>
                </Card>
              </Grid.Col>
            </Grid.Row>
          </Spin>
        </Modal>
        <Button
          icon="eye"
          color="success"
          onClick={() =>
            this.setState({ showModal: true }, () => {
              this.handleShowGrades();
            })
          }
        >
          {this.props.text}
        </Button>
      </React.Fragment>
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
)(AllStudentFinalGrades);
