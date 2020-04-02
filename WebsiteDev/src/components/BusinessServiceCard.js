import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import "./BusinessServiceCard.css";
import { Divider } from "@material-ui/core";
import image from "../images/download.jpg";
import fontStyles from "../config/fontStyles.js";

function BusinessServiceCard(props) {
  const [loaded, setLoaded] = React.useState();

  const { title, image, totalReviews, averageRating, priceText, serviceDescription, numCurrentRequests} = props;

  return (
    <Card class="cardcontainer">
      <CardContent style={fontStyles.mainTextStyleBlack}>
        <Typography class="house">{title}</Typography>
        <Divider varient="middle" />
        <img src={image} />
      </CardContent>
      <Divider orientation="vertical" flexItem />
      <CardContent class="body1" style={fontStyles.mainTextStyleBlack}>
        <Typography class="rating">Rating</Typography>
        <Divider varient="middle" />
        <Typography>{averageRating} stars</Typography>
        <Typography>{totalReviews} reviews</Typography>
      </CardContent>
      <Divider orientation="vertical" flexItem />
      <CardContent class="body2" style={fontStyles.mainTextStyleBlack}>
        <Typography class="price">Price</Typography>
        <Divider varient="middle" />
  <Typography>{priceText}</Typography>
      </CardContent>
      <Divider orientation="vertical" flexItem />
      <CardContent class="body3" style={fontStyles.mainTextStyleBlack}>
        <Typography class="description">Description</Typography>
        <Divider varient="middle" />
        <Typography>
         {serviceDescription}
        </Typography>
      </CardContent>
      <Divider orientation="vertical" flexItem />
      <CardContent class="body4" style={fontStyles.mainTextStyleBlack}>
        <Typography class="requests">Requests</Typography>
        <Divider varient="middle" />
        <Typography>{numCurrentRequests} upcoming requests</Typography>
      </CardContent>
    
      <Divider orientation="vertical" flexItem />
    </Card>
  );
}

export default BusinessServiceCard;
