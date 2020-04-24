import React, { Component } from "react";
import PropTypes from 'prop-types';


class TitleComponent extends Component {
render() {
  const { text, isCentered, marginLeft, backgroundColor, textColor } = this.props;
  const mystyle = {
   color: this.props.textColor !== null? this.props.textColor: "#00B0F0",
   backgroundColor: this.props.backgroundColor !== null? this.props.backgroundColor: "#fff",
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
  fontSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string
};
}

//exports the module
export default TitleComponent;