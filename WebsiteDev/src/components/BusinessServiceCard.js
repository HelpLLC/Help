import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import "../components/BusinessServiceCard.css";
import { Divider } from "@material-ui/core";
import image from "../images/download.jpg";
import fontStyles from "../config/fontStyles.js";
import { FaArrowDown } from "react-icons/fa";

class BusinessServiceCard extends Component {
  render() {
    return (
      <Card class="container">
        <CardContent style={fontStyles.mainTextStyleBlack}>
          <Typography class="header">House cleaning</Typography>
          <Divider varient="middle" />
          <img src={image} />
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent style={fontStyles.mainTextStyleBlack}>
          <Typography class="header">Rating</Typography>
          <Divider varient="middle" />
          <FaArrowDown />
          <Typography>5 Stars</Typography>
          <Typography>252 Reviews</Typography>
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent class="body2" style={fontStyles.mainTextStyleBlack}>
          <Typography class="header">Price</Typography>
          <Divider varient="middle" />
          <Typography>$120 per 4 hours</Typography>
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent class="body3" style={fontStyles.mainTextStyleBlack}>
          <Typography class="header">Description</Typography>
          <Divider varient="middle" />
          <Typography>
            We offer the best house cleaning in the <br /> Northwest. Anything
            from carpet cleaning...
          </Typography>
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent class="body4" style={fontStyles.mainTextStyleBlack}>
          <Typography class="header">Requests</Typography>
          <Divider varient="middle" />
          <Typography>137 requests in the past month</Typography>
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent class="body5" style={fontStyles.mainTextStyleBlack}>
          <Typography class="header">Days offered</Typography>
          <Divider varient="middle" />
          <Typography>M/T/F</Typography>
        </CardContent>
        <Divider orientation="vertical" flexItem />
      </Card>
    );
  }
}

export default BusinessServiceCard;
