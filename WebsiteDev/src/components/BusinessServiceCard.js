import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import "./BusinessServiceCard.css";
import { Divider } from "@material-ui/core";
import image from "../images/download.jpg";
import fontStyles from "../config/fontStyles.js";

class BusinessServiceCard extends Component {
  render() {
    return (
      <Card class="container">
        <CardContent style={fontStyles.mainTextStyleBlack}>
          <Typography class="house">House cleaning</Typography>
          <Divider varient="middle" />
          <img src={image} />
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent style={fontStyles.mainTextStyleBlack}>
          <Typography class="header">Rating</Typography>
          <Divider varient="middle" />
          <Typography>5 Stars</Typography>
          <Typography>252 Reviews</Typography>
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent class="body2" style={fontStyles.mainTextStyleBlack}>
          <Typography class="price">Price</Typography>
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
          <Typography class="requests">Requests</Typography>
          <Divider varient="middle" />
          <Typography>137 requests in the past month</Typography>
        </CardContent>
        <Divider orientation="vertical" flexItem />
        <CardContent class="body5" style={fontStyles.mainTextStyleBlack}>
          <Typography class="days">Days offered</Typography>
          <Divider varient="middle" />
          <Typography>M/T/F</Typography>
        </CardContent>
        <Divider orientation="vertical" flexItem />
      </Card>
    );
  }
}

export default BusinessServiceCard;
