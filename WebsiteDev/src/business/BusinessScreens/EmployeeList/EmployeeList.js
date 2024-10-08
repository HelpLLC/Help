import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import HelpTextInput from "../../../components/HelpTextInput/HelpTextInput";
import HelpButton from "../../../components/HelpButton/HelpButton";
import EmployeeListItem from "../../../components/EmployeeListItem/EmployeeListItem";
import "./EmployeeList.css";
// import '../../../config/fontStyles.css';
import strings from "../../../config/strings";
import fontStyles from "../../../config/fontStyles";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import profile_pic from "./profile_pic.png"; // Tell webpack this JS file uses this image
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import colors from "../../../config/colors";
import TitleComponent from "../../../components/TitleComponent.js";
import DialogActions from "@material-ui/core/DialogActions";
import SideMenuCard from "../../../components/SideMenu/SideMenuCard";
import DropdownHeader from "../../../components/DropdownHeader/DropdownHeader";

export default function EmployeeList(props) {
  const [assigned, setAssigned] = useState(false);
  const [businessID, setBusinessID] = useState("zjCzqSiCpNQELwU3ETtGBANz7hY2");
  const [businessName, setBusinessName] = useState();
  const [confirmed, setConfirmed] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmedDialog, setConfirmedDialog] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const confirmRequest = async () => {
    const confirm = await FirebaseFunctions.call("confirmRequest", {
      requestID: location.state.requestID,
    });
    setConfirmed(true);
    setConfirmedDialog(true);
  };
  const cancelRequest = () => {
    setConfirmed(false);
  };
  const completeRequest = () => {};

  const getBusinessName = async () => {
    const business = await FirebaseFunctions.call("getBusinessByID", {
      businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2",
    });
    setBusinessID(business);
    setBusinessName(business.businessName);
    setLoaded(true);
  };

  if (loaded === false) {
    getBusinessName();
  }

  return (
    <div>
      <section className="dropdownheader">
        <DropdownHeader
          businessID={businessID}
          businessName={businessName}
          modalClassName="modal"
          divClassName="toprightcontainer"
        />
      </section>
      <section className="sidebarHolder">
        <SideMenuCard title="Help" />
      </section>
      <div className="content_container">
        <div id="background">
          <div className="content_container">
            <div className="service_title bigTitleTextStyle darkBlue">
              Assign Employee(s)
            </div>
            <div className="searchBar">
              <HelpTextInput
                height={"5vh"}
                width={"65vw"}
                isMultiline={false}
                onChangeText={() => setSearch(search)}
                additionalIcon={
                  <FontAwesomeIcon
                    icon={["fas", "search"]}
                    size="2x"
                    style={{ padding: 10, position: "absolute" }}
                  />
                }
              ></HelpTextInput>
            </div>

            <EmployeeListItem name="John Doe" image={profile_pic} />
            <EmployeeListItem name="Anne Ketcheva" image={profile_pic} />
            <EmployeeListItem name="Tricia Cebotari" image={profile_pic} />

            {confirmed == true ? (
              <div className="confirmedButtons">
                <HelpButton
                  title={strings.CancelRequest}
                  onPress={cancelRequest}
                />
                <HelpButton
                  title={strings.CompleteRequest}
                  onPress={completeRequest}
                />
              </div>
            ) : (
              <div className="confirmRequest">
                <HelpButton
                  width={"65vw"}
                  title={strings.ConfirmRequest}
                  onPress={confirmRequest}
                />
              </div>
            )}
          </div>
        </div>
        <Dialog
          open={confirmedDialog}
          onClose={() => {
            setConfirmedDialog(false);
          }}
        >
          <TitleComponent
            fontSize={50}
            text={strings.RequestConfirmed}
            isCentered={true}
            textColor={colors.darkBlue}
          />
          <DialogContent className="dialogContent">
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.subTextStyle,
                ...fontStyles.darkBlue,
              }}
            >
              {strings.CustomerNotified}
            </DialogContentText>
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.mainTextStyle,
                ...fontStyles.darkBlue,
                ...fontStyles.bold,
              }}
            >
              {props.service}
            </DialogContentText>
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.mainTextStyle,
                ...fontStyles.darkBlue,
                ...fontStyles.bold,
              }}
            >
              {props.date}
            </DialogContentText>
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.subTextStyle,
                ...fontStyles.darkBlue,
              }}
            >
              {props.time}
            </DialogContentText>
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.subTextStyle,
                ...fontStyles.darkBlue,
              }}
            >
              {strings.RequestAddedToCalendar}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <HelpButton
              title={strings.Ok}
              onPress={() => setConfirmedDialog(false)}
              width={"100%"}
            />
          </DialogActions>
        </Dialog>
        <Dialog
          open={confirmedDialog}
          onClose={() => {
            setConfirmedDialog(false);
          }}
        >
          <TitleComponent
            fontSize={50}
            text={strings.RequestConfirmed}
            isCentered={true}
            textColor={colors.darkBlue}
          />
          <DialogContent className="dialogContent">
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.subTextStyle,
                ...fontStyles.darkBlue,
              }}
            >
              {strings.CustomerNotified}
            </DialogContentText>
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.mainTextStyle,
                ...fontStyles.darkBlue,
                ...fontStyles.bold,
              }}
            >
              {props.service}
            </DialogContentText>
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.mainTextStyle,
                ...fontStyles.darkBlue,
                ...fontStyles.bold,
              }}
            >
              {props.date}
            </DialogContentText>
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.subTextStyle,
                ...fontStyles.darkBlue,
              }}
            >
              {props.time}
            </DialogContentText>
            <DialogContentText
              style={{
                textAlign: "center",
                ...fontStyles.subTextStyle,
                ...fontStyles.darkBlue,
              }}
            >
              {strings.RequestAddedToCalendar}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <HelpButton
              title={strings.Ok}
              onPress={() => setConfirmedDialog(false)}
              width={"100%"}
            />
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
