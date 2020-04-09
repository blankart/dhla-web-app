import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import moment from 'moment';
import axios from 'axios';
import { Container, Grid, Card, Button, Form, Header, List } from 'tabler-react';
import { Alert, Upload, message } from 'antd';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import bg from '../../images/BG.png';
import { getImageUrl } from '../../utils';
function ProfileImage({ avatarURL }) {
  return <img className="card-profile-img" alt="Profile" src={avatarURL} />;
}

function Profile({
  className,
  children,
  name,
  avatarURL = '',
  twitterURL = '',
  backgroundURL = '',
  bio,
}) {
  const classes = cn('card-profile', className);
  return (
    <Card className={classes}>
      <Card.Header backgroundURL={backgroundURL} />
      <Card.Body className="text-center">
        <ProfileImage avatarURL={avatarURL} />
        <Header.H3 className="mb-3">{name}</Header.H3>
        <p className="mb-4">{bio || children}</p>
      </Card.Body>
    </Card>
  );
}
export class RegistrarProfile extends Component {
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
      imageUrl: '',
      contactNum: '',
      address: '',
      province: '',
      city: '',
      region: '',
      zipcode: '',
      civilStatus: '',
      sex: '',
      citizenship: '',
      birthDate: new Date(),
      birthPlace: '',
      religion: '',
      emergencyName: '',
      emergencyAddress: '',
      emergencyTelephone: '',
      emergencyCellphone: '',
      emergencyEmail: '',
      emergencyRelationship: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.app.showLoading && Object.keys(nextProps.app.errors).length == 0)
      this.setState({
        email: nextProps.app.auth.user.email,
        position: nextProps.app.auth.user.position,
        firstName: nextProps.app.profile.firstName,
        lastName: nextProps.app.profile.lastName,
        middleName: nextProps.app.profile.middleName,
        suffix: nextProps.app.profile.suffix,
        nickname: nextProps.app.profile.nickname,
        imageUrl: nextProps.app.profile.imageUrl,
        contactNum: nextProps.app.profile.contactNum,
        address: nextProps.app.profile.address,
        province: nextProps.app.profile.province,
        city: nextProps.app.profile.city,
        region: nextProps.app.profile.region,
        zipcode: nextProps.app.profile.zipcode,
        civilStatus: nextProps.app.profile.civilStatus,
        sex: nextProps.app.profile.sex,
        citizenship: nextProps.app.profile.citizenship,
        birthDate: nextProps.app.profile.birthDate,
        birthPlace: nextProps.app.profile.birthPlace,
        religion: nextProps.app.profile.religion,
        emergencyName: nextProps.app.profile.emergencyName,
        emergencyAddress: nextProps.app.profile.emergencyAddress,
        emergencyTelephone: nextProps.app.profile.emergencyTelephone,
        emergencyCellphone: nextProps.app.profile.emergencyCellphone,
        emergencyEmail: nextProps.app.profile.emergencyEmail,
        emergencyRelationship: nextProps.app.profile.emergencyRelationship,
        loading: false,
      });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onDateChange(event) {
    this.setState({ birthDate: event });
  }

  onSubmit(event) {
    event.preventDefault();
    const {
      firstName,
      lastName,
      middleName,
      suffix,
      nickname,
      contactNum,
      address,
      province,
      city,
      region,
      zipcode,
      civilStatus,
      sex,
      citizenship,
      birthDate,
      birthPlace,
      religion,
      emergencyName,
      emergencyAddress,
      emergencyTelephone,
      emergencyCellphone,
      emergencyEmail,
      emergencyRelationship,
    } = this.state;
    const profileData = {
      firstName,
      lastName,
      middleName,
      suffix,
      nickname,
      contactNum,
      address,
      province,
      city,
      region,
      zipcode,
      civilStatus,
      sex,
      citizenship,
      birthDate,
      birthPlace,
      religion,
      emergencyName,
      emergencyAddress,
      emergencyTelephone,
      emergencyCellphone,
      emergencyEmail,
      emergencyRelationship,
    };
    console.log(profileData);
    this.props.actions.updateRegistrarProfile(profileData);
  }

  render() {
    const {
      email,
      position,
      firstName,
      lastName,
      middleName,
      suffix,
      nickname,
      imageUrl,
      contactNum,
      address,
      province,
      city,
      region,
      zipcode,
      civilStatus,
      sex,
      citizenship,
      birthPlace,
      religion,
      emergencyName,
      emergencyAddress,
      emergencyTelephone,
      emergencyCellphone,
      emergencyEmail,
      emergencyRelationship,
    } = this.state;
    const birthDate = new Date(this.state.birthDate);
    const defaultDate = birthDate.toISOString();
    const { errors } = this.props.app;
    const uploadLoading = false;
    const displayPosition = position => {
      switch (position) {
        case false:
          return 'Administrator';
        case true:
          return 'Director';
        case 2:
          return 'Registrar';
        case 3:
          return 'Teacher';
        case 4:
          return 'Student';
        case 5:
          return 'Guardian';
        default:
          return '';
      }
    };
    const capitalize = string => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    return (
      <div className="app-admin-profile my-3 my-md-5">
        {this.state.loading ? (
          ''
        ) : (
          <Container>
            <Grid.Row>
              <Grid.Col sm={12} lg={4}>
                <Profile
                  name={`${capitalize(firstName)} ${middleName
                    .charAt(0)
                    .toUpperCase()}. ${capitalize(lastName)}`}
                  avatarURL={imageUrl == 'NA' ? placeholder : getImageUrl(imageUrl)}
                  backgroundURL={bg}
                >
                  <Upload
                    name="file"
                    multiple={false}
                    accept=".png, .jpg"
                    customRequest={(req, uploadLoading) => {
                      // Axios Photo Upload
                      this.props.actions.setLoading(true);
                      const bodyFormData = new FormData();
                      bodyFormData.set('file', req.file);
                      axios({
                        method: 'post',
                        url: 'api/users/upload',
                        data: bodyFormData,
                      })
                        .then(res => {
                          req.onSuccess();
                          this.props.actions.setLoading(false);
                          message.success('Uploaded Successfully!').then(() => {
                            window.location.href = '/profile';
                          });
                        })
                        .catch(err => {
                          req.onError();
                          this.props.actions.setLoading(false);
                          message.error('Upload failed!');
                        });
                    }}
                  >
                    <div>
                      <Header.H4>{displayPosition(position)}</Header.H4>
                    </div>
                    <Button loading={this.props.app.showLoading} icon="upload" pill color="primary">
                      Upload Image
                    </Button>
                  </Upload>
                </Profile>
              </Grid.Col>
              <Grid.Col xs={12} sm={12} lg={8}>
                <Form className="card" onSubmit={this.onSubmit}>
                  <Card.Body>
                    <Card.Title>Edit Profile</Card.Title>
                    <Grid.Row>
                      <Grid.Col xs={12} sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Email</Form.Label>
                          <Form.Input
                            type="email"
                            disabled
                            placeholder="Email"
                            value={email}
                            error={errors.email}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Position</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Position"
                            disabled
                            value={displayPosition(position)}
                            error={errors.position}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={4}>
                        <Form.Group>
                          <Form.Label>First Name</Form.Label>
                          <Form.Input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={firstName}
                            onChange={this.onChange}
                            error={errors.firstName}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={4}>
                        <Form.Group>
                          <Form.Label>Middle Name</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Middle Name"
                            value={middleName}
                            onChange={this.onChange}
                            name="middleName"
                            error={errors.middleName}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={4}>
                        <Form.Group>
                          <Form.Label>Last Name</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={this.onChange}
                            name="lastName"
                            error={errors.lastName}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={3}>
                        <Form.Group>
                          <Form.Label>Nickname</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Nickname"
                            value={nickname}
                            onChange={this.onChange}
                            name="nickname"
                            error={errors.nickname}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={3}>
                        <Form.Group>
                          <Form.Label>Suffix</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Suffix"
                            value={suffix}
                            onChange={this.onChange}
                            name="suffix"
                            error={errors.suffix}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Contact Number</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Contact Number"
                            value={contactNum}
                            onChange={this.onChange}
                            name="contactNum"
                            error={errors.contactNum}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={12}>
                        <Form.Group>
                          <Form.Label>Address</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Home Address"
                            value={address}
                            onChange={this.onChange}
                            name="address"
                            error={errors.address}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={4}>
                        <Form.Group>
                          <Form.Label>Province</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Province"
                            value={province}
                            onChange={this.onChange}
                            name="province"
                            error={errors.province}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={4}>
                        <Form.Group>
                          <Form.Label>City</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={this.onChange}
                            name="city"
                            error={errors.city}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={2}>
                        <Form.Group>
                          <Form.Label>Region</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Region"
                            value={region}
                            onChange={this.onChange}
                            name="region"
                            error={errors.region}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={2}>
                        <Form.Group>
                          <Form.Label>Zipcode</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Postal Code"
                            value={zipcode}
                            onChange={this.onChange}
                            name="zipcode"
                            error={errors.zipcode}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={4}>
                        <Form.Group>
                          <Form.Label>Civil Status</Form.Label>
                          <Form.Select
                            value={civilStatus}
                            onChange={this.onChange}
                            name="civilStatus"
                          >
                            <option>SINGLE</option>
                            <option>MARRIED</option>
                            <option>WIDOWED</option>
                            <option>OTHERS</option>
                          </Form.Select>
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={2}>
                        <Form.Group>
                          <Form.Label>Sex</Form.Label>
                          <Form.Select value={sex} onChange={this.onChange} name="sex">
                            <option>M</option>
                            <option>F</option>
                          </Form.Select>
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Citizenship</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Citizenship"
                            value={citizenship}
                            onChange={this.onChange}
                            name="citizenship"
                            error={errors.citizenship}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={4}>
                        <Form.Group>
                          <Form.Label>Birth Date</Form.Label>
                          <Form.DatePicker
                            defaultDate={new Date(defaultDate)}
                            format="mm/dd/yyyy"
                            onChange={this.onDateChange}
                            name="birthDate"
                            maxYear={2020}
                            minYear={1897}
                            monthLabels={[
                              'January',
                              'February',
                              'March',
                              'April',
                              'May',
                              'June',
                              'July',
                              'August',
                              'September',
                              'October',
                              'November',
                              'December',
                            ]}
                          ></Form.DatePicker>
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={4}>
                        <Form.Group>
                          <Form.Label>Birth Place</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Birth Place"
                            value={birthPlace}
                            onChange={this.onChange}
                            name="birthPlace"
                            error={errors.birthPlace}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={4}>
                        <Form.Group>
                          <Form.Label>Religion</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Religion"
                            value={religion}
                            onChange={this.onChange}
                            name="religion"
                            error={errors.religion}
                          />
                        </Form.Group>
                      </Grid.Col>
                    </Grid.Row>
                  </Card.Body>
                  <Card.Body>
                    <Card.Title>Emergency Contact Information</Card.Title>
                    <Grid.Row>
                      <Grid.Col sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Contact Person</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Contact Person"
                            value={emergencyName}
                            onChange={this.onChange}
                            name="emergencyName"
                            error={errors.emergencyName}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Contact Address</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Contact Address"
                            value={emergencyAddress}
                            onChange={this.onChange}
                            name="emergencyAddress"
                            error={errors.emergencyAddress}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Contact Telephone No.</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Contact Telephone No."
                            value={emergencyTelephone}
                            onChange={this.onChange}
                            name="emergencyTelephone"
                            error={errors.emergencyTelephone}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Contact Cellphone No.</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Contact Cellphone No."
                            value={emergencyCellphone}
                            onChange={this.onChange}
                            name="emergencyCellphone"
                            error={errors.emergencyCellphone}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Contact Email</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Contact Email"
                            value={emergencyEmail}
                            onChange={this.onChange}
                            name="emergencyEmail"
                            error={errors.emergencyEmail}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>Contact Relationship</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Contact Relationship"
                            value={emergencyRelationship}
                            onChange={this.onChange}
                            name="emergencyRelationship"
                            error={errors.emergencyRelationship}
                          />
                        </Form.Group>
                      </Grid.Col>
                    </Grid.Row>
                  </Card.Body>
                  <Card.Footer className="text-right">
                    <Button type="submit" color="primary">
                      Update Profile
                    </Button>
                  </Card.Footer>
                </Form>
              </Grid.Col>
            </Grid.Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarProfile);
