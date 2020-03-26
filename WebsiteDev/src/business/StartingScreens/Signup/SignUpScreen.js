import React, { useState, Fragment } from "react";
// import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import EditText from "../../../components/EditText.js";
import ButtonComponent from "../../../components/ButtonComponent.js";
import TitleComponent from "../../../components/TitleComponent.js";
import TimePicker from "../../../components/TimePicker.js";
import DayText from "../../../components/DayText.js";
import "./Signup.css";
import * as firebase from 'firebase'
import FirebaseFunctions from '../../../config/FirebaseFunctions'

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
      // width: 200,
    }
  }
}));

export default function Signup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [failed, setFailed] = useState(false)
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
  const classes = useStyles();

  function validateForm() {
    //  return email.length > 0 && password.length > 0;
    return true;
  }

  function handleSubmit(event) {}

  function handleChange(time) {}

  const mystyle = {
    color: "#00B0F0",
    fontFamily: "Arial Rounded MT Bold",
    marginLeft: "10px",
    fontSize: 14,
    marginTop: "27px"
  };

  const editTextWidth = "600px";
  const dayMarginLeft = "100px";
  const dayMarginTop = "15px";
  const timeWidth = "62px";
  const timeMarginTop = "18px";
  const secondTimeMarginLeft = "12px";
  const mondayMarginLeft = "140px";
  const tuesdayMarginLeft = "135px";
  const wednesdayMarginLeft = "105px";
  const thursdayMarginLeft = "127px";
  const fridayMarginLeft = "158px";
  const saturdayMarginLeft = "132px";
  const sundayMarginLeft = "147px";
  const titleMarginLeft = "775px";
  const schedulingTitleSize = 25;

  const signup = async () => {
    if(email.length >1 && password && businessName && businessDescription && location && website && phoneNumber && mondayStartTime){
      setFailed(false)
      const mondayFrom = parseTime(mondayStartTime)
      const mondayTo = parseTime(mondayEndTime)
      const tuesdayFrom = parseTime(tuesdayStartTime)
      const tuesdayTo = parseTime(tuesdayEndTime)
      const wednesdayFrom = parseTime(wednesdayStartTime)
      const wednesdayTo = parseTime(wednesdayEndTime)
      const thursdayFrom = parseTime(thursdayStartTime)
      const thursdayTo = parseTime(thursdayEndTime)
      const fridayFrom = parseTime(fridayStartTime)
      const fridayTo = parseTime(fridayEndTime)
      const saturdayFrom = parseTime(saturdayStartTime)
      const saturdayTo = parseTime(saturdayEndTime)
      const sundayFrom = parseTime(sundayStartTime)
      const sundayTo = parseTime(sundayEndTime)
      const businessHours = {
        sunday: {
          from: sundayFrom,
          to: sundayTo
        },monday: {
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
        },
      }
      let account =''
      account = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await FirebaseFunctions.logIn(email, password);
      await FirebaseFunctions.call('addBusinessToDatabase', {
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
    }else {
      setFailed(true)
    }
  };

  const parseTime = (time) => {
    time = time.toTimeString()
    let hours = time.substring(0, 2)
    let minutes = time.substring(3,5)
    console.log(time)
    console.log(hours)
    console.log(minutes)
    let intHours = parseInt(hours)
    let ampm = ''
    if(intHours > 12){
      ampm = 'PM'
      intHours = intHours-12
    }else{
      ampm = 'AM'
    }
    return intHours + ':' + minutes + ' ' + ampm
  }

  return (
    <div className="SignupMain">
      <TitleComponent text={"Sign Up"} isCentered={true} />
      <TitleComponent
        text={"Business Scheduling"}
        marginLeft={titleMarginLeft}
        isCentered={false}
        fontSize={schedulingTitleSize}
      />
      <div className="Signup">
        <EditText
          labelText={"Business Email"}
          multiline={false}
          widthPercent={editTextWidth}
          onChange={(event) => {
                  setEmail(event.target.value);
                }}
          value={email}
        />
        <DayText
          text={"Monday"}
          marginLeft={dayMarginLeft}
          marginTop={dayMarginTop}
        />
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={mondayMarginLeft}
          value={mondayStartTime}
          onChange={setMondayStartTime}
        />
        <h1 style={mystyle}>{"to"}</h1>
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={secondTimeMarginLeft}
          value={mondayEndTime}
          onChange={setMondayEndTime}
        />
      </div>
      <div className="Signup">
        <EditText
          labelText={"Business Password"}
          multiline={false}
          widthPercent={editTextWidth}
          type="password"
          onChange={setPassword}
          value={password}
        />
        <DayText
          text={"Tuesday"}
          marginLeft={dayMarginLeft}
          marginTop={dayMarginTop}
        />
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={tuesdayMarginLeft}
          value={tuesdayStartTime}
          onChange={setTuesdayStartTime}
        />
        <h1 style={mystyle}>{"to"}</h1>
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={secondTimeMarginLeft}
          value={tuesdayEndTime}
          onChange={setTuesdayEndTime}
        />
      </div>
      <div className="Signup">
        <EditText
          labelText={"Business Name"}
          multiline={false}
          widthPercent={editTextWidth}
          onChange={setBusinessName}
          value={businessName}
        />
        <DayText
          text={"Wednesday"}
          marginLeft={dayMarginLeft}
          marginTop={dayMarginTop}
        />
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={wednesdayMarginLeft}
          value={wednesdayStartTime}
          onChange={setWednesdayStartTime}
        />
        <h1 style={mystyle}>{"to"}</h1>
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={secondTimeMarginLeft}
          value={wednesdayEndTime}
          onChange={setWednesdayEndTime}
        />
      </div>
      <div className="Signup">
        <EditText
          labelText={"Business Description"}
          multiline={true}
          widthPercent={editTextWidth}
          onChange={setBusinessDescription}
          value={businessDescription}
        />
        <DayText
          text={"Thursday"}
          marginLeft={dayMarginLeft}
          marginTop={dayMarginTop}
        />
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={thursdayMarginLeft}
          value={thursdayStartTime}
          onChange={setThursdayStartTime}
        />
        <h1 style={mystyle}>{"to"}</h1>
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={secondTimeMarginLeft}
          value={thursdayEndTime}
          onChange={setThursdayEndTime}
        />
      </div>
      <div className="Signup">
        <EditText
          labelText={"Business Location"}
          multiline={false}
          widthPercent={editTextWidth}
          onChange={setLocation}
          value={location}
        />
        <DayText
          text={"Friday"}
          marginLeft={dayMarginLeft}
          marginTop={dayMarginTop}
        />
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={fridayMarginLeft}
          value={fridayStartTime}
          onChange={setFridayStartTime}
        />
        <h1 style={mystyle}>{"to"}</h1>
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={secondTimeMarginLeft}
          value={fridayEndTime}
          onChange={setFridayEndTime}
        />
      </div>
      <div className="Signup">
        <EditText
          labelText={"Business Website"}
          multiline={false}
          widthPercent={editTextWidth}
          onChange={setWebsite}
          value={website}
        />
        <DayText
          text={"Saturday"}
          marginLeft={dayMarginLeft}
          marginTop={dayMarginTop}
        />
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={saturdayMarginLeft}
          value={saturdayStartTime}
          onChange={setSaturdayStartTime}
        />
        <h1 style={mystyle}>{"to"}</h1>
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={secondTimeMarginLeft}
          value={saturdayEndTime}
          onChange={setSaturdayEndTime}
        />
      </div>
      <div className="Signup">
        <EditText
          labelText={"Business Phone Number"}
          multiline={false}
          widthPercent={editTextWidth}
          onChange={setPhoneNumber}
          value={phoneNumber}
        />
        <DayText
          text={"Sunday"}
          marginLeft={dayMarginLeft}
          marginTop={dayMarginTop}
        />
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={sundayMarginLeft}
          value={sundayStartTime}
          onChange={setSundayStartTime}
        />
        <h1 style={mystyle}>{"to"}</h1>
        <TimePicker
          widthPercent={timeWidth}
          marginTop={timeMarginTop}
          marginLeft={secondTimeMarginLeft}
          value ={sundayEndTime}
          onChange={setSundayEndTime}
        />
      </div>
      <ButtonComponent text={"Sign Up!"} onClick={signup} />
      {failed === true ? <h1>Please enter valid inputs</h1> : <h1></h1>}
    </div>
  );
}
