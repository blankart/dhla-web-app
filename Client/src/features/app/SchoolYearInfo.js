import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Container, Grid, Button, Form } from 'tabler-react';
import { Spin, Typography, Modal, Descriptions } from 'antd';
import axios from 'axios';

export class SchoolYearInfo extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      schoolYear: '',
      schoolYearID: 0,
      quarter: 'Q1',
      hasActiveSY: false,
      syInput: '',
      showModal: false,
    };
    this.onChange = this.onChange.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  showModal = () => {
    Modal.confirm({
      title: 'End School Year',
      content: 'Do you want to end this school year?',
      okText: 'End',
      cancelText: 'Cancel',
      onOk: () => {
        this.props.actions.endSchoolYear({ schoolYearID: this.state.schoolYearID });
      },
      onCancel: () => {},
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      axios
        .get('api/registrar/getsy')
        .then(res => {
          this.setState({
            isLoading: false,
            schoolYear: res.data.schoolYear,
            schoolYearID: res.data.schoolYearID,
            quarter: res.data.quarter,
            hasActiveSY: true,
          });
        })
        .catch(err => {
          this.setState({ isLoading: false, hasActiveSY: false });
        });
    });
  }

  componentWillReceiveProps() {
    this.setState({ isLoading: true }, () => {
      axios
        .get('api/registrar/getsy')
        .then(res => {
          this.setState({
            isLoading: false,
            schoolYear: res.data.schoolYear,
            schoolYearID: res.data.schoolYearID,
            quarter: res.data.quarter,
            hasActiveSY: true,
          });
        })
        .catch(err => {
          this.setState({ isLoading: false, hasActiveSY: false });
        });
    });
  }

  render() {
    return (
      <Container>
        <Modal
          title="Create a New School Year"
          visible={this.state.showModal}
          onOk={() => this.props.actions.createSchoolYear({ schoolYear: this.state.syInput })}
          onCancel={() => this.setState({ showModal: false })}
          okText="Create"
          cancelText="Close"
        >
          <Grid.Col>
            <Grid.Row>
              <Grid.Col sm={12} xs={12} md={12}>
                <Form.Group>
                  <Form.Label>Enter school year:</Form.Label>
                  <Form.Input
                    placeholder="Enter school year"
                    value={this.state.syInput}
                    name="syInput"
                    onChange={this.onChange}
                  />
                </Form.Group>
                Format must be {'<year>-<year+1> (e.g. 2001-2002)'}
              </Grid.Col>
            </Grid.Row>
          </Grid.Col>
        </Modal>
        <Spin spinning={this.state.isLoading}>
          <div className="app-school-year-info card">
            <Card.Header>
              <Card.Title>School Year Information</Card.Title>
            </Card.Header>
            <Card.Body>
              <Grid.Row>
                {!this.state.isLoading && !this.state.hasActiveSY && (
                  <React.Fragment>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Typography.Title level={3} style={{ textAlign: 'center' }}>
                        There is no active school year.
                      </Typography.Title>
                    </Grid.Col>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Button.List align="center">
                        <Button
                          icon="add"
                          pill
                          outline
                          color="primary"
                          onClick={() => this.setState({ showModal: true })}
                        >
                          Create a New School Year
                        </Button>
                      </Button.List>
                    </Grid.Col>
                  </React.Fragment>
                )}
                {!this.state.isLoading && this.state.hasActiveSY && (
                  <React.Fragment>
                    <Grid.Col sm={12} xs={12} md={12}>
                      <Descriptions style={{ marginBottom: '15px', marginTop: '15px' }} bordered>
                        <Descriptions.Item span={3} label="Current School Year">
                          <b>{this.state.schoolYear}</b>
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label="Current Quarter">
                          <Form.Select
                            style={{ marginBottom: '10px' }}
                            onChange={e => this.setState({ quarter: e.target.value })}
                            value={this.state.quarter}
                          >
                            <option>Q1</option>
                            <option>Q2</option>
                            <option>Q3</option>
                            <option>Q4</option>
                          </Form.Select>

                          <span style={{ marginLeft: '10px', marginTop: '10px' }}>
                            <Button
                              style={{ marginTop: '10px' }}
                              icon="edit"
                              size="sm"
                              onClick={() => {
                                this.props.actions.changeQuarterSy({
                                  schoolYearID: this.state.schoolYearID,
                                  quarter: this.state.quarter,
                                });
                              }}
                              color="primary"
                              outline
                              block
                            >
                              Change
                            </Button>
                          </span>
                        </Descriptions.Item>
                      </Descriptions>
                      <Button.List align="right">
                        <Button color="danger" size="sm" onClick={this.showModal}>
                          End School Year
                        </Button>
                      </Button.List>
                    </Grid.Col>
                  </React.Fragment>
                )}
              </Grid.Row>
            </Card.Body>
          </div>
        </Spin>
      </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(SchoolYearInfo);
