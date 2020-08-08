import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
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
        <View >
          <Text
            style={
              (dashboardScreenStyle.CardText,
              [fontStyles.darkBlue, fontStyles.bold, fontStyles.mainTextStyle])
            }
          >
            Photography
          </Text>
          <Image source={image} style={dashboardScreenStyle.imageStyle} />
        </View>

        <View style={dashboardScreenStyle.TextPlusButton}>
          <Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.mainTextStyle], dashboardScreenStyle.BottomSpacer}>M/W/T</Text>
          <Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.mainTextStyle], dashboardScreenStyle.BottomSpacer}>$120 per Hour</Text>
          <HelpButton
            title={strings.Edit}
            onPress={() => {}}
            width={screenWidth * 0.25}
            height={screenHeight * 0.04}
          />
        </View>
      </View>
    </HelpView>
  );
};

export default dashboardScreen;
