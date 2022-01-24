import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Container, Grid } from 'tabler-react';
import { Spin } from 'antd';
import axios from 'axios';

export class StudentTooltip extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      email: '',
      position: '',
      firstName: '',
      lastName: '',
      middleName: '',
      suffix: '',
      nickname: '',
      contactNum: '',
      address: '',
      province: '',
      city: '',
      region: '',
      zipcode: '',
      civilStatus: '',
      sex: '',
      citizenship: '',
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .post('api/registrar/studentprofile', { studentID: this.props.id })
      .then(res => {
        this.setState({
          email: res.data.email,
          position: res.data.position,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          middleName: res.data.middleName,
          suffix: res.data.suffix,
          nickname: res.data.nickname,
          contactNum: res.data.contactNum,
          address: res.data.address,
          province: res.data.province,
          city: res.data.city,
          region: res.data.region,
          zipcode: res.data.zipcode,
          civilStatus: res.data.civilStatus,
          sex: res.data.sex,
          citizenship: res.data.citizenship,
          loading: false,
        });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <div className="app-student-tooltip">
        {this.state.loading ? (
          <Spin spinning={this.state.loading}></Spin>
        ) : (
          <Container>
            <Grid.Row>First name: {this.state.firstName}</Grid.Row>
            <Grid.Row>Middle name: {this.state.middleName}</Grid.Row>
            <Grid.Row>Last name: {this.state.lastName}</Grid.Row>
            <Grid.Row>Suffix: {this.state.suffix}</Grid.Row>
            <Grid.Row>Nickname: {this.state.nickname}</Grid.Row>
            <Grid.Row>Contact number: {this.state.contactNum}</Grid.Row>
            <Grid.Row>Address: {this.state.address}</Grid.Row>
            <Grid.Row>Province: {this.state.province}</Grid.Row>
            <Grid.Row>City: {this.state.city}</Grid.Row>
            <Grid.Row>Region: {this.state.region}</Grid.Row>
            <Grid.Row>Zipcode: {this.state.zipcode}</Grid.Row>
            <Grid.Row>Civil Status: {this.state.civilStatus}</Grid.Row>
            <Grid.Row>Sex: {this.state.sex}</Grid.Row>
            <Grid.Row>Citizenship: {this.state.citizenship}</Grid.Row>
          </Container>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentTooltip);
