import React from "react";
import { View, Text } from "react-native";
import LandingPageStyles from "./FeatureCardRowStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import strings from "../../config/strings";

const FeatureCardRow = () => {
  return (
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
            marginTop: "-5vh",
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
          <Text style={LandingPageStyles.cardTitle}>
            {strings.SmartScheduling}
          </Text>
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
            marginTop: "6vh",
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
            <Text style={LandingPageStyles.cardText}>
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
          <Text style={LandingPageStyles.cardTitle}>Centralized Payments</Text>
          <View>
            <Text style={LandingPageStyles.cardText}>
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
            <Text style={LandingPageStyles.cardText}>
              {strings.EmployeeText}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FeatureCardRow;
