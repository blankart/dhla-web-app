import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import { Card, Button, Grid, Table, Container, Text, Avatar } from 'tabler-react';
import axios from 'axios';
import { Pagination, Spin, Tooltip, Modal } from 'antd';
import AllStudentFinalGrades from './AllStudentFinalGrades';
import placeholder from '../../images/placeholder.jpg';
import { getImageUrl } from '../../utils';

export class RegistrarViewStudentRecordSection extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
      columns: [],
      sectionName: '',
      schoolYear: '',
      studentIDs: [],
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true }, () => {
      axios
        .post('api/registrar/getsyname', { schoolYearID: this.props.schoolYearID })
        .then(res3 => {
          this.setState({ schoolYear: res3.data.schoolYear });
        });
      axios.post('api/registrar/getsectionname', { sectionID: this.props.id }).then(res2 => {
        this.setState({ sectionName: res2.data.sectionName });
        axios
          .post('api/registrar/condensedfinalgrade', {
            sectionID: this.props.id,
            quarter: this.props.quarter,
          })
          .then(res => {
            this.setState({
              isLoading: false,
              data: res.data.data,
              columns: res.data.columns,
              studentIDs: res.data.data.map(a => a.studentID),
            });
          });
      });
    });
  }

  render() {
    const DisplayColumns = [];
    const DisplayData3 = [];
    DisplayColumns.push(<Table.ColHeader></Table.ColHeader>);
    DisplayColumns.push(<Table.ColHeader>Name</Table.ColHeader>);
    for (const [index, value] of this.state.data.entries()) {
      let tempCol = [];
      for (const [index2, value2] of value.grades.entries()) {
        tempCol.push(
          <Table.Col>
            {value2.grade == -1 ? 'N/A' : value2.grade == 'N/A' ? 'Not enrolled' : value2.grade}
          </Table.Col>,
        );
      }
      DisplayData3.push(
        <Table.Row>
          <Table.Col className="w-1">
            <Avatar imageURL={value.imageUrl == 'NA' ? placeholder : getImageUrl(value.imageUrl)} />
          </Table.Col>
          <Table.Col>{value.name}</Table.Col>
          {tempCol}
          <Table.Col>
            <Tooltip placement="top" title="View all grades">
              <AllStudentFinalGrades
                text="View All Grades"
                schoolYear={this.state.schoolYear}
                id={value.studentID}
                schoolYearID={this.props.schoolYearID}
              />
            </Tooltip>
          </Table.Col>
        </Table.Row>,
      );
    }
    for (const [index, value] of this.state.columns.entries()) {
      DisplayColumns.push(<Table.ColHeader>{value}</Table.ColHeader>);
    }
    return (
      <div className="app-registrar-view-student-record-section my-3 my-md-5">
        <Grid.Col sm={12} sm={12}>
          <Grid.Row>
            <Container>
              <Card statusColor="info">
                <Card.Body>
                  <Card.Title>Condensed Grades of {this.state.sectionName}</Card.Title>
                  <Card.Title>
                    <Grid.Row>
                      <Grid.Col sm={12} xs={12} md={12}>
                        <Button.List align="right">
                          <Button
                            disabled={DisplayData3.length == 0}
                            icon="file"
                            color="primary"
                            onClick={() =>
                              this.props.actions.generatePdfSection(
                                {
                                  studentIDs: this.state.studentIDs,
                                  quarter: this.props.quarter,
                                  schoolYearID: this.props.schoolYearID,
                                },
                                'Registrar',
                              )
                            }
                          >
                            Generate Report Card
                          </Button>
                        </Button.List>
                      </Grid.Col>
                    </Grid.Row>
                  </Card.Title>
                  <Card.Title>
                    <Text.Small>
                      S.Y. {this.state.schoolYear} {this.props.quarter}
                    </Text.Small>
                  </Card.Title>
                </Card.Body>
                <Card.Body>
                  <Spin spinning={this.state.isLoading}>
                    <Grid.Row>
                      <Table highlightRowOnHover={true} responsive={true}>
                        <Table.Header>{DisplayColumns}</Table.Header>
                        <Table.Body>
                          {DisplayData3.length == 0 ? (
                            <Table.Row>
                              <Table.Col colSpan={2}>No data available.</Table.Col>
                            </Table.Row>
                          ) : (
                            DisplayData3
                          )}
                        </Table.Body>
                      </Table>
                    </Grid.Row>
                  </Spin>
                </Card.Body>
              </Card>
            </Container>
          </Grid.Row>
        </Grid.Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarViewStudentRecordSection);
