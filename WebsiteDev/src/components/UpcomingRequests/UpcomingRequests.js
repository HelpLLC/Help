import React, { useEffect } from "react";
import { View, Text, Image } from "react-native-web";
import download from "../../images/download.jpg";
import HelpButton from "../HelpButton/HelpButton";
import colors from "../../config/colors";
import UpcomingRequestsStyles from "./UpcomingRequestsStyles";

const UpcomingRequests = () => {
  useEffect(() => {}, []);

  return (
    <View style={UpcomingRequestsStyles.Container}>
      <View style={UpcomingRequestsStyles.TitleContainer}>
        <Text style={UpcomingRequestsStyles.Title}>New Service Requests</Text>
      </View>
      <View style={UpcomingRequestsStyles.CardContainer}>
        <View>
          <Image source={download} style={UpcomingRequestsStyles.ImageStyle} />
        </View>
        <View>
          <View style={UpcomingRequestsStyles.CardTitleContainer}>
            <Text style={UpcomingRequestsStyles.CardTitle}>Photography</Text>
          </View>
          <View style={UpcomingRequestsStyles.DateContainer}>
            <Text
              style={UpcomingRequestsStyles.Date}
            >
              April 28th, 2020
            </Text>
          </View>
          <View style={UpcomingRequestsStyles.ButtonContainer}>
            <HelpButton title="View More" isSmallButton2={true} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default UpcomingRequests;
