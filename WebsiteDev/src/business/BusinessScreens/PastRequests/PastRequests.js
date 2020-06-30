import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./PastRequests.css";
import ServiceHistoryCard from "../../../components/ServiceHistoryCard/ServiceHistoryCard";
import "../../../config/fontStyles.css";
import "./PastRequests.css";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import strings from "../../../config/strings";
import SideMenuCard from "../../../components/SideMenu/SideMenuCard";
import DropdownHeader from "../../../components/DropdownHeader/DropdownHeader";

export default function PastRequests(props) {
  let history = useHistory();
  const [service, setService] = useState();
  const [serviceID, setServiceID] = useState();
  const [completedRequests, setCompletedRequests] = useState();
  const [businessID, setBusinessID] = useState("zjCzqSiCpNQELwU3ETtGBANz7hY2");
  const [businessName, setBusinessName] = useState();
  const [loaded, setLoaded] = useState(false);

 
  const getBusinessName = async () => {
    const business = await FirebaseFunctions.call("getBusinessByID", {
      businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2"
    });
    setBusinessID(business);
    setBusinessName(business.businessName);
    setLoaded(true);
  };

  if (loaded === false) {
    getBusinessName();
  }

  useEffect(async () => {
    const { serviceID, service } = this.props.navigation.state.params;
    const completedRequests = await FirebaseFunctions.call(
      "getCompletedRequestsByServiceID",
      {
        serviceID,
      }
    );
    setCompletedRequests(completedRequests);
    setService(service);
    setServiceID(serviceID);
  }, []);

  const Item = (props) => {
    return <li>{props.value}</li>;
  };

  return (
    <div className="container">
      <section className="dropdownheader">
        <DropdownHeader
                businessID={businessID}
                businessName={businessName}
          modalClassName="modal"
          divClassName="toprightcontainer"
        />
      </section>
      <div className="pageContent">
        <div className="title bigTextStyle darkBlue">
          <text>{strings.PastServicesRequests}</text>
        </div>
        <ul>
          {completedRequests.map((item) => (
            <li>
              <ServiceHistoryCard
                image={async () => {
                  //Passes the function to get the profile picture of the user
                  //Passes in the function to retrieve the image of this requester
                  return await FirebaseFunctions.call("getProfilePictureByID", {
                    customerID: item.customerID,
                  });
                }}
                service={service.serviceTitle}
                name={item.customerName}
                total={item.billedAmount}
                paymentStatus={item.paymentStatus}
                completedDate={item.date}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
