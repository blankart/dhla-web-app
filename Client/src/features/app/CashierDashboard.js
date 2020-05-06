import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Container, Grid, Card, Button, Form, Header } from 'tabler-react';
import cn from 'classnames';
import placeholder from '../../images/placeholder.jpg';
import { Spin } from 'antd';
import bg from '../../images/BG.png';
import { getImageUrl } from '../../utils';
import RestrictAccount from './RestrictAccount';
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

export class CashierDashboard extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
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
      birthDate: 0,
      birthPlace: '',
      religion: '',
      emergencyName: '',
      emergencyAddress: '',
      emergencyTelephone: '',
      emergencyCellphone: '',
      emergencyEmail: '',
      emergencyRelationship: '',
    };
  }

  componentWillReceiveProps(nextProps) {
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
    });
  }

  componentDidMount() {
    if (Object.keys(this.props.app.profile).length !== 0) {
      this.setState({
        email: this.props.app.auth.user.email,
        position: this.props.app.auth.user.position,
        firstName: this.props.app.profile.firstName,
        lastName: this.props.app.profile.lastName,
        middleName: this.props.app.profile.middleName,
        suffix: this.props.app.profile.suffix,
        nickname: this.props.app.profile.nickname,
        imageUrl: this.props.app.profile.imageUrl,
        contactNum: this.props.app.profile.contactNum,
        address: this.props.app.profile.address,
        province: this.props.app.profile.province,
        city: this.props.app.profile.city,
        region: this.props.app.profile.region,
        zipcode: this.props.app.profile.zipcode,
        civilStatus: this.props.app.profile.civilStatus,
        sex: this.props.app.profile.sex,
        citizenship: this.props.app.profile.citizenship,
        birthDate: this.props.app.profile.birthDate,
        birthPlace: this.props.app.profile.birthPlace,
        religion: this.props.app.profile.religion,
        emergencyName: this.props.app.profile.emergencyName,
        emergencyAddress: this.props.app.profile.emergencyAddress,
        emergencyTelephone: this.props.app.profile.emergencyTelephone,
        emergencyCellphone: this.props.app.profile.emergencyCellphone,
        emergencyEmail: this.props.app.profile.emergencyEmail,
        emergencyRelationship: this.props.app.profile.emergencyRelationship,
      });
    }
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
        case 6:
          return 'Cashier';
        default:
          return '';
      }
    };

    const getPHTime = (date = '') => {
      const d = date === '' ? new Date() : new Date(date);
      const localOffset = d.getTimezoneOffset() * 60000;
      const UTC = d.getTime() + localOffset;
      const PHT = UTC + 3600000 * 16;
      return new Date(PHT);
    };
    const capitalize = string => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    return (
      <div className="app-cashier-dashboard my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col xs={12} md={12} md={5}>
              <Profile
                name={`${firstName} ${middleName.charAt(0).toUpperCase()}. ${lastName}`}
                avatarURL={imageUrl === 'NA' ? placeholder : getImageUrl(imageUrl)}
                backgroundURL={bg}
              >
                <div>
                  <Header.H5>{displayPosition(position)}</Header.H5>
                </div>
              </Profile>
            </Grid.Col>
            <Grid.Col xs={12} md={12} md={7}>
              <RestrictAccount />
            </Grid.Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(CashierDashboard);
