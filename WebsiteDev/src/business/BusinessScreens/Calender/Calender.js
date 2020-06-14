import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
import "./Calendar.css";
import "./main.css";
import fontStyles from "../../../config/fontStyles";
import colors from "../../../config/colors";
// import Card from "@material-ui/core/Card";
// import Divider from "@material-ui/core/Divider";
import HelpButton from "../../../components/HelpButton/HelpButton";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import strings from "../../../config/strings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { duration, Card } from "@material-ui/core";

// import bootstrapPlugin from '@fullcalendar/bootstrap';

export default function ReactCalendar() {
  const [arrayOfDisplayedRequests, setArrayOfDisplayedRequests] = useState([]);
  const [daySelected, setDaySelected] = useState("");
  const [startDate, setStartDate] = useState("");
  const [requestsInSidemenu, setRequestsInSidemenu] = useState([]);
  //this should be set when a specific request in the side menu is clicked
  const [selectedSideMenuRequest, setSelectedSideMenuRequest] = useState();
  let [open, isOpen] = useState(false);
  let [viewButtonPressed, isViewButtonPressed] = useState(false);
  let [dayClicked, isDayClicked] = useState(false);

  const fecthFunc = async () => {
    const upComingRequests = await FirebaseFunctions.call(
      "getUpcomingRequestByBusinessID",
      {
        day: daySelected,
        businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2",
      }
    );

    const fullMonthRequests = await FirebaseFunctions.call(
      "getCurrentRequestsForTheNextMonthByBusinessID",
      {
        day: startDate,
        businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2",
      }
    );

    setArrayOfDisplayedRequests([fullMonthRequests]);
    setRequestsInSidemenu(upComingRequests);
  };

  const requests = [
    {
      payment: "cash",
      name: "Zyad",
      location: "Woodinville",
      date: "9/26/2020",
      questions: "What is your Phone Number?",
      serviceTitle: "Sample Service",
      time: "5:20 PM",
      duration: "1.25 Hours",
      questions: [
        {
          question: "What is your Phone Number?",
          answer: "4252299185",
        },
      ],
    },
  ];

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
  let selected_datetime = new Date(daySelected);
  let selected_formatted_date =
    days[selected_datetime.getDay()] +
    ", " +
    months[selected_datetime.getMonth()] +
    " " +
    (selected_datetime.getDate() + 1) +
    ", " +
    selected_datetime.getFullYear();

  //This is for if we want the person to open calendar and have the side menu open to the upcoming requests on that day
  //reason there are two of the day arrays is beacuse daySelected returns a different string than highlightedday
  const daysmodified = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let highlightedDay = Date();
  let current_datetime = new Date(highlightedDay);
  let formatted_date =
    daysmodified[current_datetime.getDay()] +
    ", " +
    months[current_datetime.getMonth()] +
    " " +
    current_datetime.getDate() +
    ", " +
    current_datetime.getFullYear();

  //when calendar is first opened it will display that days requests
  const highlightedDayRequests = async () => {
    const upComingRequests = await FirebaseFunctions.call(
      "getUpcomingRequestByBusinessID",
      {
        day: highlightedDay,
        businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2",
      }
    );
    setRequestsInSidemenu(upComingRequests);
  };

  useEffect(() => {
    fecthFunc();
    //sets the side menue to open when calendar is deployed and displays the highlighted days requests
    isOpen(true);
    highlightedDayRequests();
  }, []);

  return (
    <div>
      <div className="headerdiv">
        <h1 style={fontStyles.bigSubTitleStyle} className="Cheader">
          Calendar
        </h1>
        <div className="bell">
          <FontAwesomeIcon icon="bell" size="2x" color={colors.black} />
        </div>
        <div className="usercircle">
          <FontAwesomeIcon
            icon="user-circle"
            size="3x"
            color={colors.lightBlue}
          />
          <p className="businessprofilename" style={fontStyles.bigTextStyle}>
            Business
          </p>
        </div>
      </div>
      <div className="screenbody">
        <div>
          <FullCalendar
            className="calendar"
            defaultView="dayGridMonth"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            header={{
              left: "dayGridMonth timeGridWeek",
              center: "title",
              right: "prev,next today",
            }}
            dateClick={async (info) => {
              setDaySelected(info.dateStr);
              isOpen(true);
              isDayClicked(true);
            }}
            events={(fetchInfo, successCallback, failureCallback) => {
              //   // const theFirstOfTheMonth = Date(fetchInfo.start)
              //   // console.log(theFirstOfTheMonth);
              // //   setStartDate(theFirstOfTheMonth);

              // successCallback(fullMonthRequests.map((requestObject) => {
              //   return {
              //     title: requestObject.serviceTitle,
              //     start: new Date(requestObject.date),
              //   };
              // }));
            }}
          />
        </div>
        <div>
          {open === true ? (
            viewButtonPressed === true ? (
              <div className="popupmenu">
                <div className="buttonheaders">
                  <button
                    className="closingbutton"
                    onClick={() => {
                      isOpen(false);
                      isViewButtonPressed(false);
                    }}
                  >
                    <FontAwesomeIcon icon="times" size="2x" />
                  </button>
                  <button
                    className="backbutton"
                    onClick={() => {
                      isViewButtonPressed(false);
                    }}
                  >
                    <FontAwesomeIcon icon="arrow-left" size="2x" />
                  </button>
                </div>
                {/* change to selectedSideMenuRequest */}
                {requests.map((value) => (
                  <div className="viewmoreinfo darkBlue bold">
                    <div className="topfourth">
                      <p className="mainTextStyle ">{value.serviceTitle}</p>
                      <p className="bigSubTitleStyle ">
                        {selected_formatted_date}
                      </p>
                      <p className="bigSubTitleStyle">{value.time}</p>
                    </div>
                    <hr className="blueline" />
                    <div className="requesterinformation">
                      <div>
                        <p>{strings.RequestFromHeader}</p>
                        <FontAwesomeIcon icon="user-circle" size="4x" />
                      </div>
                      <div className="requestername subTextStyle">
                        {value.name}
                      </div>
                    </div>
                    <hr className="blueline" />
                    <div className="assignedemployees">
                      <p>{strings.AssignedEmployeesHeader}</p>
                    </div>
                    <hr className="blueline" />
                    <div className="notes">
                      <p>{strings.NotesHeader}</p>
                      <p>
                        {strings.PaymentType} {value.payment}
                      </p>
                      <p className="questions">
                        {value.questions[0].question}
                        {value.questions[0].answer}
                      </p>
                    </div>
                    <div className="shownoteshelpbutton">
                      <HelpButton
                        fontStyle={{
                          ...fontStyles.smallTextStyle,
                          ...fontStyles.white,
                          ...fontStyles.bold,
                        }}
                        title={strings.ShowAllNotesSubHeader}
                        width={"8vw"}
                        height={"4vh"}
                      />
                    </div>
                    <hr className="blueline" />
                    <div className="lasttwobuttons">
                      <div className="adjustjobhelpbutton">
                        <HelpButton
                          fontStyle={{
                            ...fontStyles.subTextStyle,
                            ...fontStyles.white,
                            ...fontStyles.bold,
                          }}
                          title={strings.AdjustJobHeader}
                          width={"12vw"}
                          height={"5vh"}
                        />
                      </div>
                      <div className="markcompletehelpbutton">
                        <HelpButton
                          fontStyle={{
                            ...fontStyles.subTextStyle,
                            ...fontStyles.white,
                            ...fontStyles.bold,
                          }}
                          title={strings.MarkasComplete}
                          width={"12vw"}
                          height={"5vh"}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="popupmenu">
                <button
                  className="closingbutton"
                  onClick={() => {
                    isOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon="times" size="2x" />
                </button>

                <div className="divwrap">
                  {requests.map((value) => (
                    <div>
                      {dayClicked === true ? (
                        <p className="dateSidemenu subTextStyle darkBlue bold">
                          {selected_formatted_date}
                        </p>
                      ) : (
                        <p className="dateSidemenu subTextStyle darkBlue bold">
                          {formatted_date}
                        </p>
                      )}
                      <div className="servicecard">
                        <div className="servicecardcontents smallTextStyle darkBlue bold">
                          <div className="servicecardinfo">
                            <p>{value.serviceTitle}</p>
                            <p>{value.time}</p>
                          </div>
                        </div>
                        {/* {requestsInSidemenu.map((requestObject) => (
                    <div>
                      <p>{requestObject.date}</p>
                      <div className="servicecard">
                        {requestsInSidemenu.map((requestObject) => (
                          <div className="servicecardcontents smallTextStyle darkBlue bold">
                            {requestObject.serviceTitle} <br />
                            <br />
                            {requestObject.time}
                          </div>
                        ))} */}
                        <div className="servicecardhelpbutton">
                          <HelpButton
                            width={"10vw"}
                            height={"4vh"}
                            title={strings.ViewMore}
                            onPress={
                              () => isViewButtonPressed(true)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
