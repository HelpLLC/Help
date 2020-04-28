import React, { Component } from "react";
import "./Dashboard.css";
import Header from "../Header/Header";
import "../Header/Header.css";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import BusinessServiceCard from "../../../components/BusinessServiceCard/BusinessServiceCard";
import { useLocation, Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

export default function Dashboard(props) {
  const [business, setBusiness] = React.useState();
  const [services, setServices] = React.useState();
  const [loaded, setLoaded] = React.useState(false);
  const [image, setImage] = React.useState("");
  const location = useLocation();

  const componentDidMount = async () => {
    const businessID = location.state.businessID;
    const business = await FirebaseFunctions.call("getBusinessByID", {
      businessID,
    });
    setBusiness(business);
    setServices(business.services);
    setLoaded(true);
  };

  if (loaded === false) {
    componentDidMount();
  }

  return (
    <div className="container">
      <div className="title-container">
        <h1 className="title">Current Services</h1>
      </div>
      {
        <div class="servicecardlistcontainer">
          {loaded
            ? services.map((service) => (
                <div>
                  <BusinessServiceCard
                    title={service.serviceTitle}
                    totalReviews={service.totalReviews}
                    averageRating={service.averageRating}
                    priceText={service.priceText}
                    serviceDescription={service.serviceDescription}
                    numCurrentRequests={service.numCurrentRequests}
                    image={async () => {
                      //Passes in the function to retrieve the image of this product
                      return await FirebaseFunctions.call(
                        "getServiceImageByID",
                        { serviceID: service.serviceID }
                      );
                    }}
                  />
                </div>
              ))
            : null}
          <div class="createproductlink">
            <Link to={{ pathname: "/createproduct", state: { business: business } }}>
              Add Service
            </Link>
          </div>
        </div>
      }
    </div>
  );
}
