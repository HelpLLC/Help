import React, { useState, Fragment } from "react";
// import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';
import EditText from '../components/EditText.js';
import ButtonComponent from '../components/ButtonComponent.js';
import TitleComponent from '../components/TitleComponent.js';
import TimePicker from '../components/TimePicker.js';
import DayText from "../components/DayText.js";
import './Signup.css';


const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      // width: 200,
    },
  },
}));


export default function Signup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();

  function validateForm() {
	//  return email.length > 0 && password.length > 0;
	return true;
  }

  function handleSubmit(event) {
  }

  function handleChange(time) {
  }

  const mystyle = {
   color: "#00B0F0",
   backgroundColor: "#fff",
   fontFamily: "Arial Rounded MT Bold",
   marginLeft: "10px",
   fontSize: 14,
   marginTop: '27px'
 };

 const editTextWidth = '600px';
 const dayMarginLeft = '100px';
 const dayMarginTop = '15px';
 const timeWidth = '62px';
 const timeMarginTop = '18px';
 const secondTimeMarginLeft = '12px';
 const mondayMarginLeft = '140px';
 const tuesdayMarginLeft = '135px';
 const wednesdayMarginLeft = '105px';
 const thursdayMarginLeft = '127px';
 const fridayMarginLeft = '158px';
 const saturdayMarginLeft = '132px';
 const sundayMarginLeft = '147px';
 const titleMarginLeft = '775px';
 const schedulingTitleSize = 25;
  
  return (
    <div className="SignupMain">
         <TitleComponent text={'Sign Up'} isCentered={true} />
         <TitleComponent text={'Business Scheduling'} marginLeft={titleMarginLeft} isCentered={false} fontSize={schedulingTitleSize} />
         <div className="Signup">
            <EditText labelText={'Business Email'} multiline={false} widthPercent={editTextWidth} />
            <DayText text={'Monday'} marginLeft={dayMarginLeft} marginTop={dayMarginTop} />
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={mondayMarginLeft}/>
            <h1 style={mystyle}>{"to"}</h1>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={secondTimeMarginLeft}/>
         </div>
         <div className="Signup">
            <EditText labelText={'Business Password'} multiline={false} widthPercent={editTextWidth} type="password"/>
            <DayText text={'Tuesday'} marginLeft={dayMarginLeft} marginTop={dayMarginTop}/>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={tuesdayMarginLeft}/>
            <h1 style={mystyle}>{"to"}</h1>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={secondTimeMarginLeft}/>
         </div>
         <div className="Signup">
            <EditText labelText={'Business Name'} multiline={false} widthPercent={editTextWidth} />
            <DayText text={'Wednesday'} marginLeft={dayMarginLeft} marginTop={dayMarginTop}/>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={wednesdayMarginLeft}/>
            <h1 style={mystyle}>{"to"}</h1>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={secondTimeMarginLeft}/>
         </div>
         <div className="Signup">
            <EditText labelText={'Business Description'} multiline={true} widthPercent={editTextWidth} />
            <DayText text={'Thursday'} marginLeft={dayMarginLeft} marginTop={dayMarginTop}/>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={thursdayMarginLeft}/>
            <h1 style={mystyle}>{"to"}</h1>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={secondTimeMarginLeft}/>
         </div>
         <div className="Signup">
            <EditText labelText={'Business Location'} multiline={false} widthPercent={editTextWidth} />
            <DayText text={'Friday'} marginLeft={dayMarginLeft} marginTop={dayMarginTop}/>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={fridayMarginLeft}/>
            <h1 style={mystyle}>{"to"}</h1>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={secondTimeMarginLeft}/>
         </div>
         <div className="Signup">
            <EditText labelText={'Business Website'} multiline={false} widthPercent={editTextWidth} />
            <DayText text={'Saturday'} marginLeft={dayMarginLeft} marginTop={dayMarginTop}/>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={saturdayMarginLeft}/>
            <h1 style={mystyle}>{"to"}</h1>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={secondTimeMarginLeft}/>
         </div>
         <div className="Signup">
            <EditText labelText={'Business Phone Number'} multiline={false} widthPercent={editTextWidth} />
            <DayText text={'Sunday'} marginLeft={dayMarginLeft} marginTop={dayMarginTop}/>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={sundayMarginLeft}/>
            <h1 style={mystyle}>{"to"}</h1>
            <TimePicker widthPercent={timeWidth} marginTop={timeMarginTop} marginLeft={secondTimeMarginLeft}/>
         </div>
         <ButtonComponent text={'Sign Up!'}/>
    </div>
  );
}