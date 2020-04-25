import React from "react";
import "./LandingPage.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import LoginRegister from "../Authentication/LoginRegister";
import strings from "../../../config/strings";
import fontStyles from "../../../config/fontStyles";
import HelpButton from "../../../components/HelpButton/HelpButton";
import { screenHeight, screenWidth } from "../../../config/dimensions";
import { Text, Image, View } from "react-native-web";
import { Box } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LandingPage() {
  //To save code, this generates each reduntant section in the landing page

  return (
    <div>
      <section className="sec3"></section>
      <section className="sec2">
        <div style={{ flexDirection: "row" }}>
          <div>
            <div className="titlecontainer3">
              <Text
                style={{
                  fontSize: 100,
                  color: "white",
                  fontFamily: "Lucidda Grande",
                  fontWeight: "bold",
                }}
              >
                Let us Help your business thrive.
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
        <div className="titlecontainer4">
          <Text
            style={{
              fontSize: 100,
              color: "#567681",
              fontFamily: "Lucidda Grande",
              fontWeight: "bold",
            }}
          >
            Our Services
          </Text>
        </div>
        <div className="titlecontainer4" style={{ marginTop: "1%" }}>
          <Text
            style={{
              fontSize: 60,
              color: "#00B0F0",
              fontFamily: "Lucidda Grande",
            }}
          >
            What We Do Best
          </Text>
        </div>

          <div>
            <View
              style={{
                marginLeft: "5%",
                width: "20%",
                height: "20%",
                borderWidth: 2,
                borderColor: "#00B0F0",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
              }}
            >
              <View
                style={{
                  background: "#00B0F0",
                  width: "10vw",
                  padding: 20,
                  height: '10vw',
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "5%",
                  borderRadius: "5vw",
                  alignContent: "center",
                  flexDirection: "row",
                }}
              >
                <FontAwesomeIcon
                  icon={["fas", "calendar-alt"]}
                  style={{
                    overflow: "hidden",
                    fontFamily: "Lucida Grande",
                    fontSize: "67px",
                    textAlign: "left",
                    color: "#000000",
                    marginTop: "2.5%",
                  }}
                />
              </View>
              <View style={{ justifyContent: "center", alignItems: "center", textAlign: 'center' }}>
                <Text
                  style={{
                    fontFamily: "Lucida Grande",
                    fontSize: 40,
                    color: "#567681",
                    fontWeight: 'bold'
                  }}
                >
                  Smart Scheduling
                </Text>
                <Text>
                  <Text
                    style={{
                      fontFamily: "Lucida Grande",
                      fontSize: 30,
                      color: "#567681",
                    }}
                  >
                    Automate your schedule by having customers schedule a time
                    that works for them and for you.
                  </Text>
                </Text>
              </View>
            </View>
          </div>
          <div>
            <View
              style={{
                marginLeft: "5%",
                width: "20%",
                height: "20%",
                borderWidth: 2,
                borderColor: "#00B0F0",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
              }}
            >
              <View
                style={{
                  background: "#00B0F0",
                  width: "50%",
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "5%",
                  borderRadius: "100%",
                  alignContent: "center",
                  flexDirection: "row",
                }}
              >
                <FontAwesomeIcon
                  icon={["fas", "calendar-alt"]}
                  style={{
                    overflow: "hidden",
                    fontFamily: "Lucida Grande",
                    fontSize: "67px",
                    textAlign: "left",
                    color: "#000000",
                    marginTop: "2.5%",
                  }}
                />
              </View>
              <View style={{ justifyContent: "center", alignItems: "center", textAlign: 'center' }}>
                <Text
                  style={{
                    fontFamily: "Lucida Grande",
                    fontSize: 40,
                    color: "#567681",
                    fontWeight: 'bold'
                  }}
                >
                  Smart Scheduling
                </Text>
                <Text>
                  <Text
                    style={{
                      fontFamily: "Lucida Grande",
                      fontSize: 30,
                      color: "#567681",
                    }}
                  >
                    Automate your schedule by having customers schedule a time
                    that works for them and for you.
                  </Text>
                </Text>
              </View>
            </View>
          </div>
      </section>
    </div>
  );
}
