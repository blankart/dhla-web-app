import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card, Form, Button, Grid, Alert } from 'tabler-react';

export class AdminCreateAccount extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      position: '',
      middleName: '',
      errors: {},
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      position: this.state.position,
      middleName: this.state.middleName,
      errors: {},
    };
    this.props.actions.createAccount(userData);
  }

  componentDidMount() {
    this.setState({
      email: '',
      firstName: '',
      lastName: '',
      position: 1,
      middleName: '',
      errors: {},
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ errors: nextProps.app.errors });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    const { email, firstName, middleName, lastName, position, errors } = this.state;
    return (
      <div className="app-admin-create-account">
        <Form className="card" onSubmit={this.onSubmit}>
          <Card.Body>
            <Card.Title>Create an account</Card.Title>
            <Grid.Row>
              <Grid.Col xs={12} sm={12} md={12}>
                <Alert icon="bell" type="success">
                  Default password for user accounts: first name + last name + 123{' '}
                </Alert>
              </Grid.Col>
              <Grid.Col xs={12} sm={12} md={7}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    error={errors.email}
                    onChange={this.onChange}
                  ></Form.Input>
                </Form.Group>
              </Grid.Col>
              <Grid.Col xs={12} sm={12} md={5}>
                <Form.Group>
                  <Form.Label>Position</Form.Label>
                  <Form.Select value={position} onChange={this.onChange} name="position">
                    <option value="1">Director</option>
                    <option value="2">Registrar</option>
                    <option value="3">Teacher</option>
                    <option value="4">Student</option>
                    <option value="5">Parent or Guardian</option>
                  </Form.Select>
                </Form.Group>
              </Grid.Col>
              <Grid.Col xs={12} sm={12} md={4}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Input
                    name="firstName"
                    placeholder="First Name"
                    value={firstName}
                    error={errors.firstName}
                    onChange={this.onChange}
                  ></Form.Input>
                </Form.Group>
              </Grid.Col>
              <Grid.Col xs={12} sm={12} md={4}>
                <Form.Group>
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Input
                    name="middleName"
                    placeholder="Middle Name"
                    value={middleName}
                    error={errors.middleName}
                    onChange={this.onChange}
                  ></Form.Input>
                </Form.Group>
              </Grid.Col>
              <Grid.Col xs={12} sm={12} md={4}>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Input
                    name="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    error={errors.lastName}
                    onChange={this.onChange}
                  ></Form.Input>
                </Form.Group>
              </Grid.Col>
            </Grid.Row>
          </Card.Body>
          <Card.Footer className="text-right">
            <Button type="submit" color="primary">
              Create an account
            </Button>
          </Card.Footer>
        </Form>
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
)(AdminCreateAccount);
