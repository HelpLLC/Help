import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import "../../../config/fontStyles.css";
import HelpButton from "../../../components/HelpButton/HelpButton";
import strings from "../../../config/strings";
import HelpTextInput from "../../../components/HelpTextInput/HelpTextInput";
import TimePicker from "../../../components/TimePicker/TimePicker";
import { useLocation, useHistory } from "react-router-dom";
import HelpAlert from "../../../components/HelpAlert/HelpAlert";
import Resizer from "react-image-file-resizer";
import colors from "../../../config/colors";
import ReactLoading from "react-loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import "../CreateServiceScreen/CreateServiceScreen.css";
import SideMenuCard from "../../../components/SideMenu/SideMenuCard";
import DropdownHeader from "../../../components/DropdownHeader/DropdownHeader";

const EditProfile = () => {
  //Global constants
  const defaultStart = new Date();
  defaultStart.setHours(9, 0);
  const defaultEnd = new Date();
  defaultEnd.setHours(17, 0);
  const location = useLocation();
  const history = useHistory();
  const { businessID } = location.state;

  //The state for this screen
  const [business, setBusiness] = useState("");
  const [companyInfoSelected, setCompanyInfoSelected] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessScheduleSelected, setBusinessInfoSelected] = useState(false);
  const [passwordSelected, setPasswordSelected] = useState(false);
  const [sunday, setSunday] = useState({
    start: defaultStart,
    end: defaultEnd,
  });
  const [monday, setMonday] = useState({
    start: defaultStart,
    end: defaultEnd,
  });
  const [tuesday, setTuesday] = useState({
    start: defaultStart,
    end: defaultEnd,
  });
  const [wednesday, setWednesday] = useState({
    start: defaultStart,
    end: defaultEnd,
  });
  const [thursday, setThursday] = useState({
    start: defaultStart,
    end: defaultEnd,
  });
  const [friday, setFriday] = useState({
    start: defaultStart,
    end: defaultEnd,
  });
  const [saturday, setSaturday] = useState({
    start: defaultStart,
    end: defaultEnd,
  });
  const [image, setImage] = useState("");
  const [imageUpdated, setImageUpdated] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordsMustMatchVisible, setPasswordsMustMatchVisible] = useState(
    false
  );
  const [incorrectPasswordVisible, setIncorrectPasswordVisible] = useState(
    false
  );
  const [passwordTooShortVisible, setPasswordTooShortVisible] = useState(false);
  const [emailFormattingVisible, setEmailFormattingVisible] = useState(false);
  const [fieldsErrorVisible, setFieldsErrorVisible] = useState(false);
  const [timeErrorVisible, setTimeErrorVisible] = useState(false);
  const [passwordChanged, setPasswordChangedVisible] = useState(false);
  const [infoUpdated, setInfoUpdated] = useState(false);

  //This method is going to fetch the information about the business and set the correct states to it
  const fetchBusinessData = async () => {
    const functionResults = await Promise.all([
      FirebaseFunctions.call("getBusinessByID", {
        businessID,
      }),
      FirebaseFunctions.call("getBusinessProfilePictureByID", { businessID }),
    ]);
    const businessObject = functionResults[0];
    const imageURI = functionResults[1];
    setImagePreview(imageURI.uri);
    setImage(imageURI);
    setBusinessName(businessObject.businessName);
    setBusiness(businessObject);
    setEmail(businessObject.email);
    setWebsite(businessObject.website);
    setAddress(businessObject.location);
    setPhoneNumber(businessObject.phoneNumber);
    setBusinessDescription(businessObject.businessDescription);

    //Calls the function to format and set the business schedulue
    setBusinessSchedule(businessObject);

    setIsScreenLoading(false);
  };

  //This helper function is responsible for setting the initial values for the business schedule by converting
  //the times into date objects, which is what's accepted by the TimePicker component
  const setBusinessSchedule = (businessObject) => {
    const { businessHours } = businessObject;
    for (const day of Object.keys(businessHours)) {
      const { from, to } = businessHours[day];
      const start = new Date();
      const end = new Date();

      const startAMPM = from.split(" ")[1];
      const endAMPM = to.split(" ")[1];

      let startHours = parseInt(from.split(" ")[0].split(":")[0]);
      let endHours = parseInt(to.split(" ")[0].split(":")[0]);
      let startMinutes = parseInt(from.split(" ")[0].split(":")[1]);
      let endMinutes = parseInt(to.split(" ")[0].split(":")[1]);

      if (startAMPM === "PM" && startHours !== 12) {
        startHours += 12;
      }
      if (endAMPM === "PM" && endAMPM !== 12) {
        endHours += 12;
      }

      start.setHours(startHours, startMinutes);
      end.setHours(endHours, endMinutes);

      if (day === "sunday") {
        setSunday({
          start,
          end,
        });
      } else if (day === "monday") {
        setMonday({
          start,
          end,
        });
      } else if (day === "tuesday") {
        setTuesday({
          start,
          end,
        });
      } else if (day === "wednesday") {
        setWednesday({
          start,
          end,
        });
      } else if (day === "thursday") {
        setThursday({
          start,
          end,
        });
      } else if (day === "friday") {
        setFriday({
          start,
          end,
        });
      } else if (day === "saturday") {
        setSaturday({
          start,
          end,
        });
      }
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

  //This method is going to handle the logic for changing the password for a business
  const changePassword = async () => {
    setIsLoading(true);
    if (newPassword !== confirmNewPassword) {
      setPasswordsMustMatchVisible(true);
    } else if (newPassword.length < 6) {
      setPasswordTooShortVisible(true);
    } else {
      const result = await FirebaseFunctions.resetPassword(
        business.email,
        oldPassword,
        newPassword
      );
      if (result === -1) {
        setIncorrectPasswordVisible(true);
      } else {
        setPasswordChangedVisible(true);
      }
    }
    setIsLoading(false);
  };

  //This method is going to adjust any necessary information in the business information section of the edit
  //profile
  const saveBusinessInformation = async () => {
    setIsLoading(true);
    //Tests if there are any empty feels
    if (
      businessName.trim() === "" ||
      email.trim() === "" ||
      phoneNumber.trim() === "" ||
      address.trim() === "" ||
      businessDescription.trim() === ""
    ) {
      setFieldsErrorVisible(true);
      setIsLoading(false);
    } else {
      //Constructs the necessary promises
      const promises = [];

      //The promise to edit the business fields
      promises.push(
        FirebaseFunctions.call("updateBusinessInformation", {
          businessID: business.businessID,
          updates: {
            businessName,
            email,
            website,
            phoneNumber,
            location: address,
            businessDescription,
          },
        })
      );

      //Checks if the user's image needs to be updated
      if (imageUpdated === true) {
        promises.push(
          FirebaseFunctions.storage
            .ref("businessProfilePics/" + business.businessID)
            .put(image)
        );
      }

      //Checks if the business email needs to be updated
      if (email !== business.email) {
        if (email.includes(".") && email.includes("@")) {
          promises.push(FirebaseFunctions.updateEmail(email));
        } else {
          setEmailFormattingVisible(true);
        }
      }

      await Promise.all(promises);
      await fetchBusinessData();

      setInfoUpdated(true);
      setIsLoading(false);
    }
  };

  //This method is going to handle changing the business schedule. It will check if there's anything that doesn't make
  //sense, like the to time being earlier than the for time, then it will update the schedule by converting the dates
  //accordingly
  const saveBusinessSchedule = async () => {
    setIsLoading(true);
    const arrayOfDays = {
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    };
    const finalSchedule = {};
    for (const day of Object.keys(arrayOfDays)) {
      const dayObject = arrayOfDays[day];
      const { start, end } = dayObject;
      if (start.getTime() - end.getTime() > 0) {
        setTimeErrorVisible(true);
        setIsLoading(false);
        return;
      }
      let fromHours = start.getHours();
      let fromAMPM = "";
      let fromMinutes = start.getMinutes();
      let toHours = end.getHours();
      let toAMPM = "";
      let toMinutes = end.getMinutes();

      if (fromHours > 12) {
        fromHours -= 12;
        fromAMPM = "PM";
      } else {
        fromAMPM = "AM";
      }
      if (toHours > 12) {
        toHours -= 12;
        toAMPM = "PM";
      } else {
        toAMPM = "AM";
      }

      if (fromMinutes < 10) {
        fromMinutes = "0" + fromMinutes;
      }
      if (toMinutes < 10) {
        toMinutes = "0" + toMinutes;
      }

      let from = fromHours + ":" + fromMinutes + " " + fromAMPM;
      let to = toHours + ":" + toMinutes + " " + toAMPM;
      finalSchedule[day] = {
        from,
        to,
      };
      await FirebaseFunctions.call("updateBusinessInformation", {
        businessID: business.businessID,
        updates: {
          businessHours: finalSchedule,
        },
      });
    }
    setIsLoading(false);
    setInfoUpdated(true);
  };

  //This method is going to render the time pickers for each time object
  const renderTimePicker = (dayString, index) => {
    return (
      <div className="days">
        <label id="day_title" className="mainTextStyle gray">
          {dayString}
        </label>
        <TimePicker
          widthPercent={"10vw"}
          marginLeft="20px"
          value={
            index === 0
              ? sunday.start
              : index === 1
              ? monday.start
              : index === 2
              ? tuesday.start
              : index === 3
              ? wednesday.start
              : index === 4
              ? thursday.start
              : index === 5
              ? friday.start
              : saturday.start
          }
          onChange={(time) =>
            index === 0
              ? setSunday({ start: time, end: sunday.end })
              : index === 1
              ? setMonday({ start: time, end: monday.end })
              : index === 2
              ? setTuesday({ start: time, end: tuesday.end })
              : index === 3
              ? setWednesday({ start: time, end: wednesday.end })
              : index === 4
              ? setThursday({ start: time, end: thursday.end })
              : index === 5
              ? setFriday({ start: time, end: friday.end })
              : setSaturday({ start: time, end: saturday.end })
          }
        />
        <label id="to_text" className="mainTextStyle gray">
          {strings.to}
        </label>
        <TimePicker
          widthPercent={"10vw"}
          marginLeft="20px"
          value={
            index === 0
              ? sunday.end
              : index === 1
              ? monday.end
              : index === 2
              ? tuesday.end
              : index === 3
              ? wednesday.end
              : index === 4
              ? thursday.end
              : index === 5
              ? friday.end
              : saturday.end
          }
          onChange={(time) =>
            index === 0
              ? setSunday({ end: time, start: sunday.start })
              : index === 1
              ? setMonday({ end: time, start: monday.start })
              : index === 2
              ? setTuesday({ end: time, start: tuesday.start })
              : index === 3
              ? setWednesday({ end: time, start: wednesday.start })
              : index === 4
              ? setThursday({ end: time, start: thursday.start })
              : index === 5
              ? setFriday({ end: time, start: friday.start })
              : setSaturday({ end: time, start: saturday.start })
          }
        />
      </div>
    );
  };

  // Renders the UI of the screen. If the screen is loading, displays a loading state
  if (isScreenLoading === true) {
    return (
      <div className="serviceScreen">
        <ReactLoading type={"bars"} color={colors.lightBlue} width="10vw" />
      </div>
    );
  }
  return (
    <div className="editProfileContainer">
      <section className="dropdownheader">
        <DropdownHeader
          businessID={business}
          businessName={businessName}
          modalClassName="modal"
          divClassName="toprightcontainer"
        />
      </section>
      <section className="sidebarHolder">
        <SideMenuCard title="Help" businessID={businessID} />
      </section>
      <div className="profileHolder">
        <div className="editProfileCard">
          <div className="cardSideBarContainer">
            <div className="infoHolder">
              <div className="imageContainer">
                <img src={imagePreview} className="businessProfileImageSmall" />
              </div>
              <div className="nameContainer">
                <text className="subTextStyle black bold">{businessName}</text>
              </div>
            </div>
            <div className="titleColumnContainer">
              <div
                className={
                  companyInfoSelected
                    ? "sectionTitleContainerSelected"
                    : "sectionTitleContainer"
                }
                onClick={() => {
                  setBusinessInfoSelected(false);
                  setPasswordSelected(false);
                  setCompanyInfoSelected(true);
                }}
              >
                <div className="textPositioner">
                  <text
                    className={
                      companyInfoSelected
                        ? "subTextStyle white bold"
                        : "subTextStyle darkBlue bold"
                    }
                  >
                    {strings.CompanyInfo}
                  </text>
                </div>
              </div>
            </div>
            <div
              className={
                businessScheduleSelected
                  ? "sectionTitleContainerSelected"
                  : "sectionTitleContainer"
              }
              onClick={() => {
                setCompanyInfoSelected(false);
                setPasswordSelected(false);
                setBusinessInfoSelected(true);
              }}
            >
              <div className="textPositioner">
                <text
                  className={
                    businessScheduleSelected
                      ? "subTextStyle white bold"
                      : "subTextStyle darkBlue bold"
                  }
                >
                  {strings.BusinessSchedule}
                </text>
              </div>
            </div>
            <div
              className={
                passwordSelected
                  ? "sectionTitleContainerSelected"
                  : "sectionTitleContainer"
              }
              onClick={() => {
                setCompanyInfoSelected(false);
                setBusinessInfoSelected(false);
                setPasswordSelected(true);
              }}
            >
              <div className="textPositioner">
                <text
                  className={
                    passwordSelected
                      ? "subTextStyle white bold"
                      : "subTextStyle darkBlue bold"
                  }
                >
                  {strings.Password}
                </text>
              </div>
            </div>
          </div>
          {companyInfoSelected ? (
            <div>
              <div className="titleContainer">
                <text className="bigTextStyle darkBlue bold">
                  {strings.BusinessInformation}
                </text>
              </div>
              <div>
                <button className="imagePickerSection2">
                  <div className="topRow">
                    <div>
                      <input
                        disabled={isLoading}
                        type="file"
                        accept="image/png, image/jpeg"
                        id="upload"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files.length) {
                            setImagePreview(
                              URL.createObjectURL(e.target.files[0])
                            );
                            setImageUpdated(true);
                            Resizer.imageFileResizer(
                              e.target.files[0],
                              400,
                              250,
                              "JPEG",
                              100,
                              0,
                              (uri) => {
                                setImage(uri);
                              },
                              "blob"
                            );
                          }
                        }}
                      />
                      <label htmlFor="upload">
                        <div
                          className="imagePickerCircle"
                          id="imagePickerCircle"
                        >
                          <img
                            src={imagePreview}
                            className="businessProfileImage"
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </button>
              </div>
              <div className="secondRow">
                <div className="input1">
                  <text className="subTextStyle darkBlue bold">
                    {strings.BusinessName}
                  </text>
                  <div className="inputcontainer">
                    <HelpTextInput
                      height={"5vh"}
                      width={"20vw"}
                      isMultiline={false}
                      value={businessName}
                      onChangeText={(text) => setBusinessName(text)}
                    />
                  </div>
                </div>
                <div className="input2">
                  <text className="subTextStyle darkBlue bold">
                    {strings.Email}
                  </text>
                  <div className="inputcontainer">
                    <HelpTextInput
                      height={"5vh"}
                      width={"20vw"}
                      isMultiline={false}
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                    />
                  </div>
                </div>
              </div>
              <div className="secondRow">
                <div className="input1">
                  <text className="subTextStyle darkBlue bold">
                    {strings.Website}
                  </text>
                  <div className="inputcontainer">
                    <HelpTextInput
                      height={"5vh"}
                      width={"20vw"}
                      isMultiline={false}
                      value={website}
                      onChangeText={(text) => setWebsite(text)}
                    />
                  </div>
                </div>
                <div className="input2">
                  <text className="subTextStyle darkBlue bold">
                    {strings.PhoneNumber}
                  </text>
                  <div className="inputcontainer">
                    <HelpTextInput
                      height={"5vh"}
                      width={"20vw"}
                      isMultiline={false}
                      value={phoneNumber}
                      onChangeText={(text) => setPhoneNumber(text)}
                    />
                  </div>
                </div>
              </div>
              <div className="secondRow">
                <div className="input1">
                  <text className="subTextStyle darkBlue bold">
                    {strings.Address}
                  </text>
                  <div className="inputcontainer">
                    <HelpTextInput
                      height={"5vh"}
                      width={"45vw"}
                      isMultiline={false}
                      value={address}
                      onChangeText={(text) => setAddress(text)}
                    />
                  </div>
                </div>
              </div>
              <div className="secondRow">
                <div className="input1">
                  <text className="subTextStyle darkBlue bold">
                    {strings.BusinessDescription}
                  </text>
                  <div className="inputcontainer">
                    <HelpTextInput
                      height={"10vh"}
                      width={"45vw"}
                      isMultiline={true}
                      value={businessDescription}
                      onChangeText={(text) => setBusinessDescription(text)}
                    />
                  </div>
                </div>
              </div>
              <div className="helpbutton">
                <HelpButton
                  title={strings.SaveChanges}
                  isLoading={isLoading}
                  width="20vw"
                  height="7.5vh"
                  onPress={() => {
                    saveBusinessInformation();
                  }}
                />
              </div>
            </div>
          ) : businessScheduleSelected ? (
            <div>
              <div className="titleContainer">
                <text className="bigTextStyle darkBlue bold">
                  {strings.BusinessSchedule}
                </text>
              </div>
              {[
                strings.Sunday,
                strings.Monday,
                strings.Tuesday,
                strings.Wednesday,
                strings.Thursday,
                strings.Friday,
                strings.Saturday,
              ].map((dayString, index) => renderTimePicker(dayString, index))}
              <div className="helpbutton3">
                <HelpButton
                  title={strings.SaveChanges}
                  width="20vw"
                  height="7.5vh"
                  isLoading={isLoading}
                  onPress={() => saveBusinessSchedule()}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="titleContainer">
                <text className="bigTextStyle darkBlue bold">
                  {strings.ChangePassword}
                </text>
              </div>
              <div className="secondRow">
                <div className="input1">
                  <text className="subTextStyle darkBlue bold">
                    {strings.OldPassword}
                  </text>
                  <div className="inputcontainer">
                    <HelpTextInput
                      height={"5vh"}
                      width={"15vw"}
                      isMultiline={false}
                      value={oldPassword}
                      onChangeText={(text) => setOldPassword(text)}
                      password={true}
                    />
                  </div>
                </div>
              </div>
              <div className="secondRow">
                <div className="input1">
                  <text className="subTextStyle darkBlue bold">
                    {strings.NewPassword}
                  </text>
                  <div className="inputcontainer">
                    <HelpTextInput
                      height={"5vh"}
                      width={"15vw"}
                      isMultiline={false}
                      value={newPassword}
                      onChangeText={(text) => setNewPassword(text)}
                      password={true}
                    />
                  </div>
                </div>
              </div>
              <div className="secondRow">
                <div className="input1">
                  <text className="subTextStyle darkBlue bold">
                    {strings.ConfirmNewPassword}
                  </text>
                  <div className="inputcontainer">
                    <HelpTextInput
                      height={"5vh"}
                      width={"15vw"}
                      isMultiline={false}
                      value={confirmNewPassword}
                      onChangeText={(text) => setConfirmNewPassword(text)}
                      password={true}
                    />
                  </div>
                </div>
              </div>
              <div className="helpbutton2">
                <HelpButton
                  title={strings.SaveChanges}
                  isLoading={isLoading}
                  width="20vw"
                  height="7.5vh"
                  onPress={() => changePassword()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <HelpAlert
        isVisible={passwordChanged}
        onClose={() => setPasswordChangedVisible(false)}
        titleText={strings.Success}
        messageText={strings.YourPasswordHasBeenChanged}
      />
      <HelpAlert
        isVisible={passwordTooShortVisible}
        onClose={() => setPasswordTooShortVisible(false)}
        titleText={strings.Whoops}
        messageText={strings.PasswordLengthMessage}
      />
      <HelpAlert
        isVisible={passwordsMustMatchVisible}
        onClose={() => setPasswordsMustMatchVisible(false)}
        titleText={strings.Whoops}
        messageText={strings.PasswordsMustMatchMessage}
      />
      <HelpAlert
        isVisible={incorrectPasswordVisible}
        onClose={() => setIncorrectPasswordVisible(false)}
        titleText={strings.Whoops}
        messageText={strings.IncorrectPasswordMessage}
      />
      <HelpAlert
        isVisible={infoUpdated}
        onClose={() => setInfoUpdated(false)}
        titleText={strings.Success}
        messageText={strings.YourInfoHasBeenUpdated}
      />
      <HelpAlert
        isVisible={timeErrorVisible}
        onClose={() => setTimeErrorVisible(false)}
        titleText={strings.Whoops}
        messageText={strings.TimeErrorMessage}
      />
      <HelpAlert
        isVisible={fieldsErrorVisible}
        onClose={() => setFieldsErrorVisible(false)}
        titleText={strings.Whoops}
        messageText={strings.PleaseCompleteAllFields}
      />
      <HelpAlert
        isVisible={emailFormattingVisible}
        onClose={() => setEmailFormattingVisible(false)}
        titleText={strings.Whoops}
        messageText={strings.EmailFormattingErrorMessage}
      />
    </div>
  );
};

export default EditProfile;
