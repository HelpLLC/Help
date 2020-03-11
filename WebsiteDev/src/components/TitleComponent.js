import React, { Component } from "react";
import PropTypes from 'prop-types';


class TitleComponent extends Component {
render() {
  const { text, isCentered, marginLeft } = this.props;
  const mystyle = {
   color: "#00B0F0",
   backgroundColor: "#fff",
   padding: "10px",
   fontFamily: "Arial Rounded MT Bold",
   textAlign: this.props.isCentered === true ? "center" : "",
   marginLeft: this.props.marginLeft,
   fontSize: this.props.fontSize !== null? this.props.fontSize: 30
 };

  return (
     
    <div >
        <h1 style={mystyle}>{this.props.text}</h1>
    </div>
  );
}

propTypes = {
  text: PropTypes.string.isRequired,
  isCentered: PropTypes.bool.isRequired,
  marginLeft: PropTypes.number,
  fontSize: PropTypes.number
};
}

//exports the module
export default TitleComponent;