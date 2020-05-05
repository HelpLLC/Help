import React from "react";
import "./LandingPage.css";
import { useHistory } from "react-router-dom";
import strings from "../../../config/strings";
import HelpButton from "../../../components/HelpButton/HelpButton";
import {Image } from "react-native-web";
import FeatureCardRow from "../../../components/FeatureCardRow/FeatureCardRow";

export default function LandingPage() {
  //To save code, this generates each reduntant section in the landing page
  const history = useHistory();

  return (
    <div>
      <section className="sec2">
        <div className="topSection">
          <div>
            <div className="titlecontainer3">
              <h1 className="hugeTitleTextWhite">{strings.LetUsHelp}</h1>
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
      </section>
      <section className="sec1"></section>
      <section>
        <div className="titlecontainer4">
          <h1 className="hugeTitleTextGrey">{strings.OurServices}</h1>
        </div>
        <div className="titlecontainer4" style={{ marginTop: "1%" }}>
          <h1 className="hugeSubTitleTextBlue">{strings.WhatWeDoBest}</h1>
        </div>
        <FeatureCardRow />
      </section>
      <section className="sec4" />
      <section className="sec5">
        <div className="bottomSectionContainer">
          <div className="bottomSectionSubContainer">
            <div className="titlecontainer5">
              <h1 className="hugeTitleTextWhite">
                <span>{strings.StartSelling}</span>
                <span>{strings.Today}</span>
              </h1>
            </div>
            ]
            <div>
              <h1 className="hugeTextWhite">{strings.ConnectText}</h1>
            </div>
            <div className="landingPageButtonContainer2">
              <HelpButton
                title={strings.SignUp}
                onPress={() => {
                  history.push("/signUp");
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
          <div
            style={{
              alignItems: "row-reverse",
              marginLeft: "5vw",
              marginTop: "10vh",
            }}
          >
            <h1 className="giganticText">{strings.Help}</h1>
          </div>
        </div>
      </section>
    </div>
  );
}
