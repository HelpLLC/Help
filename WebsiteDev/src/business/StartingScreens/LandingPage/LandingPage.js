import React from "react";
import "./LandingPage.css";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import LoginRegister from "../Authentication/LoginRegister";
import strings from "../../../config/strings";
import fontStyles from "../../../config/fontStyles";
import HelpButton from "../../../components/HelpButton/HelpButton";
import { screenHeight, screenWidth } from "../../../config/dimensions";
import { Text, Image, View } from "react-native-web";
import { Box, StylesProvider } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LandingPageStyles from "./LandingPageStyles";

export default function LandingPage() {
  //To save code, this generates each reduntant section in the landing page
  const history = useHistory();

  return (
    <div>
      <section className="sec3"></section>
      <section className="sec2">
        <div style={{ flexDirection: "row" }}>
          <div>
            <div className="titlecontainer3">
              <Text style={LandingPageStyles.titleWhite}>
                {strings.LetUsHelp}
              </Text>
            </div>
            <div style={{ width: "30%", marginLeft: "14vw", marginTop: "2%" }}>
              <HelpButton
                title={strings.WorkTogether}
                onPress={() => {
                  history.push("/signUp");
                }}
              />
            </div>
          </div>
          <div>
            <Image />
          </div>
        </div>
      </section>
      <section className="sec1"></section>
      <section>
        <div className="titlecontainer4">
          <Text style={LandingPageStyles.titleNavy}>{strings.OurServices}</Text>
        </div>
        <div className="titlecontainer4" style={{ marginTop: "1%" }}>
          <Text style={LandingPageStyles.subtitleBlue}>{strings.WhatWeDoBest}</Text>
        </div>
        <View style={LandingPageStyles.cardRowContainer}>
          <View style={LandingPageStyles.cardContainer}>
            <View
              style={{
                background: "#00B0F0",
                width: "10vw",
                padding: 20,
                height: "10vw",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5vw",
                alignContent: "center",
                marginTop: '-5vh'
              }}
            >
              <FontAwesomeIcon
                icon={["fas", "calendar-alt"]}
                style={{
                  overflow: "hidden",
                  fontSize: "67px",
                  textAlign: "left",
                  color: "#000000",
                }}
              />
            </View>
            <View style={LandingPageStyles.cardTextContainer}>
              <Text style={LandingPageStyles.cardTitle}>{strings.SmartScheduling}</Text>
              <View>
                <Text style={LandingPageStyles.cardText}>
                 {strings.SmartSchedulingText}
                </Text>
              </View>
            </View>
          </View>
          <View style={LandingPageStyles.cardContainer}>
            <View
              style={{
                background: "#41CBEF",
                width: "10vw",
                padding: 20,
                height: "10vw",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5vw",
                alignContent: "center",
                marginTop: '6vh'
              }}
            >
              <FontAwesomeIcon
                icon={["fas", "chart-bar"]}
                style={{
                  overflow: "hidden",
                  fontSize: "67px",
                  textAlign: "left",
                  color: "#000000",
                }}
              />
            </View>
            <View style={LandingPageStyles.cardTextContainer}>
              <Text style={LandingPageStyles.cardTitle}>
                {strings.AdvancedAnalytics}
              </Text>
              <View>
                <Text
                 style={LandingPageStyles.cardText}
                >
                  {strings.AdvancedAnalyticsText}
                </Text>
              </View>
            </View>
          </View>
          <View style={LandingPageStyles.cardContainer}>
            <View
              style={{
                background: "#5CC6BC",
                width: "10vw",
                padding: 20,
                height: "10vw",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5vw",
                alignContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon={["fas", "dollar-sign"]}
                style={{
                  overflow: "hidden",
                  fontSize: "67px",
                  textAlign: "left",
                  color: "#000000",
                  marginTop: "2.5%",
                }}
              />
            </View>
            <View style={LandingPageStyles.cardTextContainer}>
              <Text style={LandingPageStyles.cardTitle}>
                Centralized Payments
              </Text>
              <View>
                <Text
                  style={LandingPageStyles.cardText}
                >
                  {strings.PaymentsText}
                </Text>
              </View>
            </View>
          </View>
          <View style={LandingPageStyles.cardContainer}>
            <View
              style={{
                background: "#8ED0AC",
                width: "10vw",
                padding: 20,
                height: "10vw",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5vw",
                alignContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon={["fas", "users"]}
                style={{
                  overflow: "hidden",
                  fontSize: "67px",
                  textAlign: "left",
                  color: "#000000",
                }}
              />
            </View>
            <View style={LandingPageStyles.cardTextContainer}>
              <Text style={LandingPageStyles.cardTitle}>
                {strings.EmployeeManagement}
              </Text>
              <View>
                <Text style={LandingPageStyles.cardText}
                >
                  {strings.EmployeeText}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </section>
      <section className="sec4" />
      <section className="sec5">
        <div style={{ flexDirection: "row", display: "flex" }}>
          <div style={{ width: "50vw" }}>
            <div className="titlecontainer5">
              <Text style={LandingPageStyles.titleWhite}>
                {strings.StartSellingToday}
              </Text>
            </div>
            ]
            <div>
              <h1
                style={{
                  fontFamily: "Lucida Grande",
                  color: "white",
                  fontSize: 50,
                  marginLeft: "5vw",
                  textAlign: "left",
                }}
              >
                {strings.ConnectText}
              </h1>
            </div>
            <div
              style={{ width: "20vw", marginLeft: "14vw", marginTop: "5vh" }}
            >
              <HelpButton
                title={strings.SignUp}
                onPress={() => {
                  history.push("/signUp");
                }}
              />
            </div>
            <div
              style={{ width: "15vw", marginLeft: "16.5vw", marginTop: "5vh" }}
            >
              <HelpButton
                title={strings.ContactUs}
                onPress={() => {
                  history.push("/contactus");
                }}
              />
            </div>
          </div>
          <div
            style={{
              alignItems: "row-reverse",
              marginLeft: "5vw",
              marginTop: "10vh",
            }}
          >
            <Text style={LandingPageStyles.bigTitleWhite}>{strings.Help}</Text>
          </div>
        </div>
      </section>
    </div>
  );
}
