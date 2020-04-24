import React, { Component } from "react";
import Calendar from "react-calendar";
import "./Calendar.css";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import { IoIosArrowForward } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import HelpButton from "../../../components/HelpButton";
import FirebaseFunctions from "../../../config/FirebaseFunctions";

export default class ReactCalendar extends Component {
  state = {
    arrayOfRequests: [],
  };

  async componentDidMount() {
    const user = await FirebaseFunctions.call(
      "getBusinessCurrentRequestsByDay",
      {
        day: "2020-04-20",
        businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2",
      }
    );
    console.log(user);
  }

  render() {
    const array = [
      "12:00 AM",
      "1:00 AM",
      "2:00 AM",
      "3:00 AM",
      "4:00 AM",
      "5:00 AM",
      "6:00 AM",
      "7:00 AM",
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
      "10:00 PM",
      "11:00 PM",
    ];
    console.log(this.state.arrayOfRequests);
    return (
      <div className="container">
        <h1 className="header">Calender</h1>
        <Calendar
          onClickDay={async (value) => {
            const dateString =
              value.getFullYear() +
              "-" +
              (value.getMonth() + 1) +
              "-" +
              value.getDate();

            const arrayOfRequests = await FirebaseFunctions.call(
              "getBusinessCurrentRequestsByDay",
              {
                day: dateString,
                businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2",
              }
            );
            this.setState({ arrayOfRequests });
          }}
        />
        <div className="divcontainer">
          <button>
            <h2 className="heading">Day</h2>
          </button>

          <button>
            <h2 className="heading">Week</h2>
          </button>

          <button>
            <h2 className="heading">Month</h2>
          </button>

          <button>
            <h2 className="heading">Year</h2>
          </button>
        </div>
        <div>
          <div className="dayscontainer">
            <button className="daysheading">Sun</button>
            <button className="daysheading">Mon</button>
            <button className="daysheading">Tue</button>
            <button className="daysheading">Wed</button>
            <button className="daysheading">Thu</button>
            <button className="daysheading">Fri</button>
            <button className="daysheading">Sat</button>
          </div>
          <Divider orientation="horizontal" />
          <div className="eventdetails">
            <div className="timecarddiv">
              <div className="timediv">
                {array.map((eachString) => (
                  <div className="arraydiv">
                    {eachString}
                    <Divider orientation="horizontal" className="divider" />
                  </div>
                ))}
              </div>
            </div>

            <div className="carddiv">
              <Card className="card">
                <div>
                  {this.state.arrayOfRequests.map((eachRequest) => {
                    return (
                      <h1 className="cardheaders">
                        {eachRequest.serviceTitle}
                      </h1>
                    );
                    console.log(eachRequest);
                  })}
                  <p className="cardtext">Woodinville</p>
                </div>
                <div className="cardtimetext">
                  <p className="timetext">
                    Tuesday, Mar 2, 2020
                    <br /> repeats monthly
                  </p>
                  <p className="timetext">7:00 pm to 8:30 pm</p>
                </div>
                <hr />
                <div className="cardadjustdiv">
                  <h3 className="cardadjust">Adjust Job</h3>
                  <IoIosArrowForward className="arrow" />
                </div>
                <hr className="horiline" />
                <div className="cardrequestdiv">
                  <IoMdPerson className="person" />
                  <div className="requestheaders">
                    <h4>Request from</h4>
                    <h5 className="requestername">Jim Halpert</h5>
                  </div>
                  <IoIosArrowForward className="arrow2" />
                </div>
                <hr className="horiline2" />
                <div>
                  <h3 className="assignedheader">Assigned Employees</h3>
                  <p className="assignedtext">Dwight Shrute</p>
                  <p className="assignedtext">Pam Beasley</p>
                  <IoIosArrowForward className="arrow3" />
                </div>
                <hr className="horiline3" />
                <div>
                  <h3 className="notesheader">Notes</h3>
                  <p className="notestext">
                    Make sure to get the job done and do a very good job most
                    important people are the customers......
                  </p>
                  <h6 className="fullnotesheader">Show all notes</h6>
                  <IoIosArrowForward className="arrow4" />
                </div>
                <hr className="horiline3" />
                <div className="helpbutton">
                  <HelpButton label="Confirm Job" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
