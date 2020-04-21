import React from "react";
import "./LandingPage.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import LoginRegister from "../Authentication/LoginRegister";
import strings from "../../../config/strings";
import fontStyles from "../../../config/fontStyles";
import HelpButton from "../../../components/HelpButton/HelpButton";
import { screenHeight, screenWidth } from "../../../config/dimensions";
import { Text, Image } from "react-native-web";
import {Box} from "@material-ui/core";

export default function LandingPage() {
  //To save code, this generates each reduntant section in the landing page

  return (
    <div>
      <section className="sec2">
        <div style={{ flexDirection: "row" }}>
          <div>
            <div className="titlecontainer">
              <Text style={{ fontSize: 100, color: "white" }}>
                Let us help your business thrive.
              </Text>
            </div>
            <div style={{ width: "30%", marginLeft: "9%", marginTop: "2%" }}>
              <HelpButton title="Let's work together" />
            </div>
          </div>
          <div>
            <Image />
          </div>
        </div>
      </section>
      <section className="sec1"></section>
      <section>
        <div className="titlecontainer2">
          <Text style={{ fontSize: 100, color: "#567681" }}>Our Services</Text>
        </div>
        <div className="titlecontainer2" style={{ marginTop: "1%" }}>
          <Text style={{ fontSize: 60, color: "#00B0F0" }}>
            What we do best
          </Text>
        </div>
        <div>
          <div>
            <Box></Box>
          </div>
        </div>
      </section>
    </div>
  );
}
