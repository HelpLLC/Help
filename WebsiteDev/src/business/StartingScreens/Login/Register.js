import React, { useState } from "react";
import loginImg from "../../../images/Login.svg";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import SignUpScreen from "../Signup/SignUpScreen.js";
import LoginRegister from "./LoginRegister";
import RegisterNavigator from "./RegisterNavigator";
import HelpButton from "../../../components/HelpButton";
import DayText from "../../../components/DayText";
import TimePicker from "../../../components/TimePicker";
import * as firebase from "firebase";
import FirebaseFunctions from "../../../config/FirebaseFunctions";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [failed, setFailed] = useState(false);
  const [mondayStartTime, setMondayStartTime] = useState();
  const [tuesdayStartTime, setTuesdayStartTime] = useState();
  const [wednesdayStartTime, setWednesdayStartTime] = useState();
  const [thursdayStartTime, setThursdayStartTime] = useState();
  const [fridayStartTime, setFridayStartTime] = useState();
  const [saturdayStartTime, setSaturdayStartTime] = useState();
  const [sundayStartTime, setSundayStartTime] = useState();
  const [mondayEndTime, setMondayEndTime] = useState();
  const [tuesdayEndTime, setTuesdayEndTime] = useState();
  const [wednesdayEndTime, setWednesdayEndTime] = useState();
  const [thursdayEndTime, setThursdayEndTime] = useState();
  const [fridayEndTime, setFridayEndTime] = useState();
  const [saturdayEndTime, setSaturdayEndTime] = useState();
  const [sundayEndTime, setSundayEndTime] = useState();

  const signup = async () => {
    if (
      email.length > 1 &&
      password &&
      businessName &&
      businessDescription &&
      location &&
      website &&
      phoneNumber &&
      mondayStartTime
    ) {
      setFailed(false);
      const mondayFrom = parseTime(mondayStartTime);
      const mondayTo = parseTime(mondayEndTime);
      const tuesdayFrom = parseTime(tuesdayStartTime);
      const tuesdayTo = parseTime(tuesdayEndTime);
      const wednesdayFrom = parseTime(wednesdayStartTime);
      const wednesdayTo = parseTime(wednesdayEndTime);
      const thursdayFrom = parseTime(thursdayStartTime);
      const thursdayTo = parseTime(thursdayEndTime);
      const fridayFrom = parseTime(fridayStartTime);
      const fridayTo = parseTime(fridayEndTime);
      const saturdayFrom = parseTime(saturdayStartTime);
      const saturdayTo = parseTime(saturdayEndTime);
      const sundayFrom = parseTime(sundayStartTime);
      const sundayTo = parseTime(sundayEndTime);
      const businessHours = {
        sunday: {
          from: sundayFrom,
          to: sundayTo
        },
        monday: {
          from: mondayFrom,
          to: mondayTo
        },
        tuesday: {
          from: tuesdayFrom,
          to: tuesdayTo
        },
        wednesday: {
          from: wednesdayFrom,
          to: wednesdayTo
        },
        thursday: {
          from: thursdayFrom,
          to: thursdayTo
        },
        friday: {
          from: fridayFrom,
          to: fridayTo
        },
        saturday: {
          from: saturdayFrom,
          to: saturdayTo
        }
      };
      let account = "";
      account = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      await FirebaseFunctions.logIn(email, password);
      await FirebaseFunctions.call("addBusinessToDatabase", {
        //Fields for the business
        businessName,
        businessDescription: businessDescription,
        businessHours,
        currentRequests: [],
        email,
        location,
        services: [],
        website,
        phoneNumber,
        isVerified: false,
        businessID: account.user.uid,
        coordinates: {
          lat: 3,
          lng: 3
        }
      });
    } else {
      setFailed(true);
    }
  };

  const parseTime = time => {
    time = time.toTimeString();
    let hours = time.substring(0, 2);
    let minutes = time.substring(3, 5);
    console.log(time);
    console.log(hours);
    console.log(minutes);
    let intHours = parseInt(hours);
    let ampm = "";
    if (intHours > 12) {
      ampm = "PM";
      intHours = intHours - 12;
    } else {
      ampm = "AM";
    }
    return intHours + ":" + minutes + " " + ampm;
  };

  return (
    <BrowserRouter>
      <div className="base-container">
        <div className="header1">Register</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt="" />
          </div>
          <div className="splitter">
            <div className="form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="username"
                  placeholder="email"
                  onChange={event => {
                    setEmail(event.target.value);
                  }}
                  value={email}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  onChange={event => {
                    setPassword(event.target.value);
                  }}
                  value={password}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Business Name</label>
                <input
                  type="name"
                  name="business name"
                  placeholder="password"
                  onChange={event => {
                    setBusinessName(event.target.value);
                  }}
                  value={businessName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Business Description</label>
                <input
                  placeholder="Info"
                  onChange={event => {
                    setBusinessDescription(event.target.value);
                  }}
                  value={businessDescription}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Business Location</label>
                <input
                  placeholder="location"
                  onChange={event => {
                    setLocation(event.target.value);
                  }}
                  value={location}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Business Website</label>
                <input
                  placeholder="website"
                  onChange={event => {
                    setWebsite(event.target.value);
                  }}
                  value={website}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Business Phone Number</label>
                <input
                  placeholder="phone number"
                  onChange={event => {
                    setPhoneNumber(event.target.value);
                  }}
                  value={phoneNumber}
                />
              </div>
            </div>
            <div className="form" style={{ marginLeft: "40px" }}>
              <div className="header1">Business Schedule </div>
              <div className="days">
                <label className="label">Monday</label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={mondayStartTime}
                  onChange={setMondayStartTime}
                />
                <label className="label" style={{ marginLeft: "10px" }}>
                  to
                </label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={mondayEndTime}
                  onChange={setMondayEndTime}
                />
              </div>
              <div className="days">
                <label className="label">Tuesday</label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={tuesdayStartTime}
                  onChange={setTuesdayStartTime}
                />
                <label className="label" style={{ marginLeft: "10px" }}>
                  to
                </label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={tuesdayEndTime}
                  onChange={setTuesdayEndTime}
                />
              </div>
              <div className="days">
                <label className="label">Wednesday</label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={wednesdayStartTime}
                  onChange={setWednesdayStartTime}
                />
                <label className="label" style={{ marginLeft: "10px" }}>
                  to
                </label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={wednesdayEndTime}
                  onChange={setWednesdayEndTime}
                />
              </div>
              <div className="days">
                <label className="label">Thursday</label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={thursdayStartTime}
                  onChange={setThursdayStartTime}
                />
                <label className="label" style={{ marginLeft: "10px" }}>
                  to
                </label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={thursdayEndTime}
                  onChange={setThursdayEndTime}
                />
              </div>
              <div className="days">
                <label className="label">Friday</label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={fridayStartTime}
                  onChange={setFridayStartTime}
                />
                <label className="label" style={{ marginLeft: "10px" }}>
                  to
                </label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={fridayEndTime}
                  onChange={setFridayEndTime}
                />
              </div>
              <div className="days">
                <label className="label">Saturday</label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={saturdayStartTime}
                  onChange={setSaturdayStartTime}
                />
                <label className="label" style={{ marginLeft: "10px" }}>
                  to
                </label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={saturdayEndTime}
                  onChange={setSaturdayEndTime}
                />
              </div>
              <div className="days">
                <label className="label">Sunday</label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={sundayStartTime}
                  onChange={setSundayStartTime}
                />
                <label className="label" style={{ marginLeft: "10px" }}>
                  to
                </label>
                <TimePicker
                  widthPercent={"62px"}
                  marginLeft="20px"
                  value={sundayEndTime}
                  onChange={setSundayEndTime}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <button className="btn" type="button" onClick={signup}>
            Login
          </button>
          {failed === true ? <h1>Please enter valid inputs</h1> : <h1></h1>}
        </div>
      </div>
    </BrowserRouter>
  );
}
