import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import HelpTextInput from "../../../components/HelpTextInput/HelpTextInput";
import HelpButton from "../../../components/HelpButton/HelpButton";
import SideMenu from "../../../components/SideMenu/SideMenu";
import "./ViewRequest.css";
import "../../../config/fontStyles.css";
import strings from "../../../config/strings";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import profile_pic from "./profile_pic.png"; // Tell webpack this JS file uses this image
import HelpAlert from "../../../components/HelpAlert/HelpAlert";
import { requestJson } from "@fullcalendar/core";

export default function ViewRequest(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [request, setRequest] = useState("");
  const [total, setTotal] = useState(props.total);
  const [confirmed, setConfirmed] = useState();
  const [clicked, isClicked] = useState(false);
  let location = useLocation();
  let history = useHistory();

  const requestID = location.state.requestID;

  const confirmRequest = async () => {
    const confirm = await FirebaseFunctions.call("confirmRequest", {
      requestID: requestID,
    });
    history.push({
      pathname: "/employees",
      state: { businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2" },
    });
  };

  const completeRequest = () => {};

  const cancelRequest = async () => {
    const cancel = await FirebaseFunctions.call("deleteRequest", {
      requestID: requestID,
    });
    history.push({
      pathname: "/dashboard",
      state: { businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2"},
    });
  };

  const displayRequestObject = async () => {
    const requestObject = await FirebaseFunctions.call("getRequestByID", {
      requestID: requestID,
    });
    setRequest(requestObject);
    setConfirmed(requestObject.confirmed);
    setIsLoading(false);
  };



  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  let datetime = new Date(request.date);
  let formatted_date =
    days[datetime.getDay()] +
    ", " +
    months[datetime.getMonth()] +
    " " +
    (datetime.getDate() + 1) +
    ", " +
    datetime.getFullYear();

  useEffect(() => {
    displayRequestObject();
  }, []);

  if (isLoading === true) {
    return <div />;
  }

  return (
    <div id="container">
      <section className="sidebarHolder">
        <SideMenu title="Request" />
      </section>
      <div className="content_container">
        <div id="rectangle_4">
          <div className="content_container">
            <div className="service_title bigTextStyle darkBlue">
              {request.serviceTitle}
            </div>
            <div className="topRow">
              <div className="profile_details">
                <img className="profile_pic" src={profile_pic}></img>
                <div className="request_from">
                  <text className="smallTextStyle darkBlue">
                    {strings.RequestFromHeader}
                  </text>
                  <text className="mainTextStyle darkBlue">
                    {request.customerName}
                  </text>
                </div>
              </div>
              <div className="request_details">
                <div className="details_column">
                  <text className="mainTextStyle darkBlue">
                    {formatted_date}
                    <br />
                    {request.time} - {request.endTime}
                  </text>
                </div>
              </div>
            </div>
            <div className="row2">
              <div className="questions">
                <text className="questions_title mainTextStyle darkBlue bold">
                  {strings.QuestionResponses}
                </text>
                {request.questions.map((eachQuestion) =>
                  eachQuestion.answer.length < 30 ? (
                    <div className="questions_asked">
                      <text className="subTextStyle darkBlue bold">
                        {eachQuestion.question}
                      </text>
                      <div className="question_response_box_smaller">
                        <p className="question_response">
                          {eachQuestion.answer}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="questions_asked">
                      <text className="subTextStyle darkBlue bold">
                        {eachQuestion.question}
                      </text>
                      <div className="question_response_box">
                        <p className="question_response">
                          {eachQuestion.answer}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="payment_container">
                <text className="mainTextStyle darkBlue bold">
                  {strings.Payment}
                </text>
                <div className="payment_background">
                  <div className="payment_column">
                    <div className="payment_method">
                      <text className="smallTextStyle darkBlue bold">
                        {request.card === true ? strings.Card : strings.Cash}
                      </text>
                      <text className="payment_right smallTextStyle darkBlue">
                        {request.paymentInformation}
                      </text>
                    </div>
                    <div className="payment_method">
                      <text className="smallTextStyle darkBlue bold">
                        {strings.Total}
                      </text>
                      <text className="payment_right smallTextStyle darkBlue">
                        {total}
                      </text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {confirmed == true ? (
              <div className="row3">
                <HelpButton
                  title={strings.CancelRequest}
                  onPress={() => isClicked(true)}
                />
                <HelpButton
                  title={strings.CompleteRequest}
                  onPress={completeRequest}
                />
              </div>
            ) : (
              <div className="confirmRequest">
                <HelpButton
                  width={"55vw"}
                  title={strings.ConfirmRequest}
                  onPress={confirmRequest}
                />
              </div>
            )}
          </div>
          <HelpAlert
          	isVisible={clicked}
            onClose={cancelRequest}
            titleText={strings.CancelRequest}
            messageText={strings.CancelRequestMessage}
            />
        </div>
      </div>
    </div>
  );
}
