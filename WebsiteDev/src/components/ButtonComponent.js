import React, { Component } from "react";
import PropTypes from 'prop-types';
 import Button from 'react-button-component';


 const CustomizedButton = Button.extend`
 color: #00B0F0;
 background: #fff;
 border: 1.5px solid #00B0F0;
 border-radius: 30px;
 width: 15%;
 display: block; 
 margin: 0 auto;
`
const mystyle = {
  color: "#00B0F0",
  backgroundColor: 'inherit',
  fontFamily: "Arial Rounded MT Bold",
  fontSize: 20
};


class ButtonComponent extends Component {
render() {

  const { text } = this.props;

  return (
     
    <div className="Signup">
        <CustomizedButton>
          <h1 style={mystyle}>{this.props.text}</h1>
        </CustomizedButton>
        
    </div>
  );
}

propTypes = {
  text: PropTypes.string.isRequired
};
}

//exports the module
export default ButtonComponent;