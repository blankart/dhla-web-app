import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Button, Container, Grid } from 'tabler-react';
import { Modal, Table, Spin } from 'antd';
import moment from 'moment';
import axios from 'axios';

export class ViewEditLog extends Component {
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
      showModal2: false,
      logDetails: [],
      selectedType: '',
    };

    this.fetchActivityLog = this.fetchActivityLog.bind(this);
  }

  fetchActivityLog = () => {
    this.setState({ isLoading: true });
    if (this.props.position == 'Teacher') {
      axios
        .post('api/teacher/getactivitylog', {
          classRecordID: this.props.classRecordID,
          quarter: this.props.quarter,
        })
        .then(res => {
          this.setState({ data: res.data.activityLog, isLoading: false });
        });
    } else if (this.props.position == 'Registrar') {
      axios
        .post('api/registrar/getactivitylog', {
          classRecordID: this.props.classRecordID,
          quarter: this.props.quarter,
        })
        .then(res => {
          this.setState({ data: res.data.activityLog, isLoading: false });
        });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          width={1000}
          title="Class Record Log"
          visible={this.state.showModal}
          footer={[
            <Button color="secondary" onClick={() => this.setState({ showModal: false })}>
              Close
            </Button>,
          ]}
          onCancel={() => this.setState({ showModal: false })}
        >
          <Modal
            width={950}
            title="Log Details"
            visible={this.state.showModal2}
            footer={[
              <Button color="secondary" onClick={() => this.setState({ showModal2: false })}>
                Close
              </Button>,
            ]}
            onCancel={() => this.setState({ showModal2: false })}
          >
            {this.state.selectedType == 'CHANGE_STATUS' && (
              <Table
                columns={[{ title: 'Description', dataIndex: 'description', render: text => text }]}
                dataSource={this.state.logDetails}
              />
            )}
            {(this.state.selectedType == 'ADD' ||
              this.state.selectedType == 'DELETE' ||
              this.state.selectedType == 'UPDATE') && (
              <Table
                columns={[
                  { title: 'Student', dataIndex: 'student', render: text => text },
                  { title: 'Component', dataIndex: 'component', render: text => text },
                  { title: 'Subcomponent', dataIndex: 'subcomponent', render: text => text },
                  { title: 'Description', dataIndex: 'description', render: text => text },
                  { title: 'Old Value', dataIndex: 'oldValue', render: text => text },
                  { title: 'New Value', dataIndex: 'newValue', render: text => text },
                ]}
                dataSource={this.state.logDetails}
              />
            )}
          </Modal>
          <Spin spinning={this.state.isLoading}>
            <Table
              columns={[
                { title: 'Name', dataIndex: 'name', render: text => text },
                { title: 'Position', dataIndex: 'position', render: text => text },
                {
                  title: 'Edit Type',
                  dataIndex: 'type',
                  render: text =>
                    text == 'ADD'
                      ? 'Grade/s Added'
                      : text == 'UPDATE'
                      ? 'Grade/s Updated'
                      : text == 'DELETE'
                      ? 'Grade/s Deleted'
                      : 'Record Status Updated',
                },
                {
                  title: 'Date',
                  dataIndex: 'timestamp',
                  render: text => moment(text).format('LLL'),
                },
                {
                  title: 'Details',
                  dataIndex: 'logDetails',
                  render: (logDetails, data) => (
                    <Button
                      size="sm"
                      color="primary"
                      pill
                      outline
                      onClick={() =>
                        this.setState({ logDetails, selectedType: data.type, showModal2: true })
                      }
                    >
                      View
                    </Button>
                  ),
                },
              ]}
              dataSource={this.state.data}
            />
          </Spin>
        </Modal>
        <Button
          icon="edit"
          outline
          color="primary"
          onClick={() =>
            this.setState({ showModal: true }, () => {
              this.fetchActivityLog();
            })
          }
        >
          View Edit Log
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewEditLog);
