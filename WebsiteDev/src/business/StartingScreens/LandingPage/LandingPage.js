import React from "react";
import "./LandingPage.css";
import { useHistory } from "react-router-dom";
import strings from "../../../config/strings";
import HelpLogo from '../LandingPage/assets/HelpLogo.png'
import HelpButton from "../../../components/HelpButton/HelpButton";
import "../../../config/fontStyles.css";
import fontStyles from "../../../config/fontStyles"
import { Image } from "react-native-web";
import FeatureCard from "../../../components/FeatureCard/FeatureCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import colors from "../../../config/colors";

export default function LandingPage() {
  //To save code, this generates each reduntant section in the landing page
  const history = useHistory();

  return (
    <div>
      <section className="sec2">
        <div className="topSection">
          <div>
            <div className="titlecontainer3">
              <text className="bigTitleTextStyle bold white">
                {strings.LetUsHelp}
              </text>
            </div>
            <div className="landingPageButtonContainer">
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

        <FontAwesomeIcon
          icon="handshake"
          color={colors.white}
          className="handshakeIcon"
        />
      </section>
      <section className="sec1"></section>
      <section>
        <div className="titlecontainer4">
          <text className="bigTitleTextStyle gray">{strings.OurServices}</text>
        </div>
        <div className="titlecontainer4">
          <text className="bigSubTitleTextStyle blue">
            {strings.WhatWeDoBest}
          </text>
        </div>
        <div className="featureRow">
          <FeatureCard
            icon={"calendar-alt"}
            title={strings.SmartScheduling}
            text={strings.SmartSchedulingText}
          />
          <FeatureCard
            icon={"chart-bar"}
            title={strings.AdvancedAnalytics}
            text={strings.AdvancedAnalyticsText}
          />
          <FeatureCard
            icon={"dollar-sign"}
            title={strings.CentralizedPayments}
            text={strings.PaymentsText}
          />
          <FeatureCard
            icon={"users"}
            title={strings.EmployeeManagement}
            text={strings.EmployeeText}
          />
        </div>
      </section>
      <section className="sec4" />
      <section className="sec5">
        <div className="bottomSectionContainer">
          <div className="bottomSectionSubContainer">
            <div className="titlecontainer5">
              <text className="bigTitleTextStyle white bold">
                {strings.StartSelling}
              </text>
              <text className="bigTitleTextStyle white bold">
                {strings.Today}
              </text>
            </div>
            <div className="titlecontainer5">
              <text className="smallerBigTextStyle white">
                {strings.ConnectText}
              </text>
            </div>
            <div className="landingPageButtonContainer2">
              <HelpButton
                title={strings.SignUp}
                onPress={() => {
                  history.push("/signUp");
                }}
                fontStyle={{
                  ...fontStyles.bigTextStyle,
                  ...fontStyles.white,
                  ...fontStyles.bold,
                }}
              />
            </div>
            <div className="landingPageButtonContainer3">
              <HelpButton
                title={strings.ContactUs}
                onPress={() => {
                  history.push("/contactus");
                }}
              />
            </div>
          </div>
          <div className="helpLogoContainer">
            <img alt={"Help - Get Things Done Logo"} className={'helpLogo'} src={HelpLogo} />
          </div>
        </div>
      </section>
    </div>
  );
}
