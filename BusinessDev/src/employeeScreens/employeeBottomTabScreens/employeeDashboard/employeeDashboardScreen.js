import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import TopBanner from '../../../components/TopBanner/TopBanner';
import HelpView from '../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpButton from '../../../components/HelpButton/HelpButton';
import employeeDashboardScreenStyle from './employeeDashboardScreenStyle';

const employeeDashboardScreen = (props) => {
  return (
    <ScrollView>
      <HelpView>
        <TopBanner
          title={strings.Dashboard}
          size={30}
          leftOnPress={() => props.navigation.goBack()}
        />
        <View>
          {/* create an if statement that says if there are any requests within the next 30 minutes then display the address with service card 
          using the "ServiceCardwithAddress" style */}
          <Text
            style={[
              fontStyles.mainTextStyle,
              fontStyles.darkBlue,
              fontStyles.bold,
              employeeDashboardScreenStyle.HeaderMargin
            ]}
          >
            In the next 30 minutes
          </Text>
          <View style={employeeDashboardScreenStyle.ServiceCardwithAddress}>
            <View style={employeeDashboardScreenStyle.TitleandLocation}>
              <Text
                style={[
                  fontStyles.subTextStyle,
                  fontStyles.darkBlue,
                  fontStyles.bold,
                  employeeDashboardScreenStyle.Title,
                ]}
              >
                Photography
              </Text>
              <Text
                style={[
                  fontStyles.smallTextStyle,
                  fontStyles.darkBlue,
                  employeeDashboardScreenStyle.AddressandAccuratetime,
                ]}
              >
                Miranda Coldwell 12345 67th AVE Northeast 891011
              </Text>
              <Text
                style={[
                  fontStyles.smallTextStyle,
                  fontStyles.lightBlue,
                  employeeDashboardScreenStyle.AddressandAccuratetime,
                ]}
              >
                In 15 Mins
              </Text>
            </View>
            <View style={employeeDashboardScreenStyle.TimeandButtonwithAdress}>
              <Text
                style={[
                  fontStyles.subTextStyle,
                  fontStyles.darkBlue,
                  fontStyles.bold,
                  employeeDashboardScreenStyle.Time,
                ]}
              >
                3:00PM - 4:00PM
              </Text>
              <View style={employeeDashboardScreenStyle.ButtonwithAddress}>
                <HelpButton
                  title={strings.ViewRequests}
                  bigText={false}
                  onPress={() => {}}
                  width={screenWidth * 0.4}
                  height={screenHeight * 0.03}
                />
              </View>
            </View>
          </View>
          <Text
            style={[
              fontStyles.mainTextStyle,
              fontStyles.darkBlue,
              fontStyles.bold,
              employeeDashboardScreenStyle.HeaderMargin
            ]}
          >
            In the next 1hr 
          </Text>
          <View style={employeeDashboardScreenStyle.ServiceCard}>
            <View style={employeeDashboardScreenStyle.TitleandAccuratetime}>
              <Text
                style={[
                  fontStyles.subTextStyle,
                  fontStyles.darkBlue,
                  fontStyles.bold,
                  employeeDashboardScreenStyle.Title,
                ]}
              >
                Photography
              </Text>
              <Text
                style={[
                  fontStyles.smallTextStyle,
                  fontStyles.lightBlue,
                  employeeDashboardScreenStyle.AddressandAccuratetime,
                ]}
              >
                In 15 Mins
              </Text>
            </View>
            <View style={employeeDashboardScreenStyle.TimeandButton}>
              <Text
                style={[
                  fontStyles.subTextStyle,
                  fontStyles.darkBlue,
                  fontStyles.bold,
                  employeeDashboardScreenStyle.Time,
                ]}
              >
                3:00PM - 4:00PM
              </Text>
              <View style={employeeDashboardScreenStyle.Button}>
                <HelpButton
                  title={strings.ViewRequests}
                  bigText={false}
                  onPress={() => {}}
                  width={screenWidth * 0.4}
                  height={screenHeight * 0.03}
                />
              </View>
            </View>
          </View>
        </View>
      </HelpView>
    </ScrollView>
  );
};

export default employeeDashboardScreen;
