import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpView from '../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpButton from '../../components/HelpButton/HelpButton';
import dashboardScreenStyle from './dashboardScreenStyle';

const dashboardScreen = (props) => {
  let image = {
    uri:
      'https://www.adorama.com/alc/wp-content/uploads/2018/07/shutterstock_170815865-1024x563.jpg',
  };
  return (
    <ScrollView>
      <HelpView style={[screenStyle.container, { alignItems: 'flex-start' }]}>
        <TopBanner
          title={strings.Dashboard}
          leftIconName='bell'
          size={30}
          leftOnPress={() => props.navigation.goBack()}
        />
        <View style={dashboardScreenStyle.AddServiceButton}>
          <HelpButton
            title={strings.AddServices}
            onPress={() => {}}
            width={screenWidth * 0.9}
            height={screenHeight * 0.05}
          />
        </View>
        <View style={dashboardScreenStyle.ServiceCard}>
          <View style={dashboardScreenStyle.ImageandTitle}>
            <Text
              style={
                ([
                  fontStyles.darkBlue,
                  fontStyles.bold,
                  fontStyles.mainTextStyle,
                  dashboardScreenStyle.BottomSpacer
                ])
              }
            >
               {/* replace with firbase input */}
              Photography
            </Text>
            <Image source={image} style={dashboardScreenStyle.imageStyle } />
          </View>

          <View style={dashboardScreenStyle.TextPlusButton}>
            <View style={dashboardScreenStyle.MiddleText}>
            <Text
              style={
                ([
                  fontStyles.darkBlue,
                  fontStyles.bold,
                  fontStyles.subTextStyle,
                   dashboardScreenStyle.BottomSpacer
                ]
               )
              }
            >
               {/* replace with firbase input */}
              M/W/T
            </Text>
            <Text
              style={
                ([
                  fontStyles.darkBlue,
                  fontStyles.bold,
                  fontStyles.mainTextStyle,
                  dashboardScreenStyle.BottomSpacer
                ])
                
              }
            >
               {/* replace with firbase input */}
              $120 per Hour
            </Text>
            </View>
            <View style={dashboardScreenStyle.EditButton}>
              <HelpButton
                title={strings.Edit}
                onPress={() => {}}
                width={screenWidth * 0.25}
                height={screenHeight * 0.04}
              />
            </View>
          </View>
        </View>
      </HelpView>
    </ScrollView>
  );
};

export default dashboardScreen;
