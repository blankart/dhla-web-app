import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Table, Container } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip, Modal, Typography } from 'antd';

export class AllStudentDeliberationGrades extends Component {
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
    };
  }

  handleViewGrades() {
    this.setState({ isLoading: true }, () => {
      axios
        .post('api/registrar/studentdeliberationrecord', { studsectID: this.props.studsectID })
        .then(res => {
          this.setState({ isLoading: false, data: res.data.data });
        });
    });
  }

  render() {
    const DisplayData = [];
    const classStanding = () => {
      let enumerator = 0,
        denom = 0;
      for (const [index, value] of this.state.data.entries()) {
        if (value.score != -1) {
          denom = denom + 1;
          enumerator = enumerator + parseFloat(value.score);
        }
      }
      if (denom != 0) {
        return parseFloat(enumerator / denom);
      } else return 'Not yet available';
    };
    for (const [index, value] of this.state.data.entries()) {
      DisplayData.push(
        <Table.Row>
          <Table.Col>{value.subjectName}</Table.Col>
          <Table.Col>{value.score == -1 ? 'Not yet available' : value.score}</Table.Col>
        </Table.Row>,
      );
    }
    return (
      <React.Fragment>
        <Modal
          title="Student Grades"
          visible={this.state.showModal}
          footer={[<Button onClick={() => this.setState({ showModal: false })}>Close</Button>]}
          onCancel={() => {
            this.setState({ showModal: false });
          }}
        >
          <Spin spinning={this.state.isLoading}>
            <Card statusColor="success">
              <Card.Body>
                <Card.Title>Current Student Record of {this.props.name}</Card.Title>
                <Container>
                  <Grid.Row>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Table highlightRowOnHover={true} responsive={true}>
                        <Table.Header>
                          <Table.ColHeader>Subject Name</Table.ColHeader>
                          <Table.ColHeader>Grade</Table.ColHeader>
                        </Table.Header>
                        <Table.Body>{DisplayData}</Table.Body>
                      </Table>
                    </Grid.Col>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Typography.Text style={{ fontSize: '18px' }}>
                        Current Class Standing (Current Quarter): <b>{classStanding()}</b>
                      </Typography.Text>
                    </Grid.Col>
                  </Grid.Row>
                </Container>
              </Card.Body>
            </Card>
          </Spin>
        </Modal>
        <Tooltip placement="top" title="View All Student Grades">
          <Button
            icon="file"
            size="sm"
            color="primary"
            outline
            pill
            onClick={() => this.setState({ showModal: true }, () => this.handleViewGrades())}
          ></Button>
        </Tooltip>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllStudentDeliberationGrades);
