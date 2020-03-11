import React, { Component } from "react";
import PropTypes from 'prop-types';


class DayText extends Component {
render() {
  const { text } = this.props;
  const mystyle = {
   color: "#00B0F0",
   backgroundColor: "#fff",
   fontFamily: "Arial Rounded MT Bold",
   marginLeft: this.props.marginLeft,
   marginTop: this.props.marginTop,
   fontSize: 20,
   padding: '10px'
 };

  return (
    <div >
        <h1 style={mystyle}>{this.props.text}</h1>
    </div>
  );
}

   propTypes = {
      text: PropTypes.string.isRequired,
      marginLeft: PropTypes.number.isRequired,
      marginTop: PropTypes.number.isRequired
   };
}

//exports the module
export default DayText;