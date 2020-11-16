import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import TopBanner from '../../../../components/TopBanner/TopBanner';
import HelpView from '../../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpButton from '../../../../components/HelpButton/HelpButton';
import serviceScreenStyle from './serviceScreenStyle';

const serviceScreen = (props) => {
  let image = {
    uri:
      'https://www.adorama.com/alc/wp-content/uploads/2018/07/shutterstock_170815865-1024x563.jpg',
  };
  return (
    <ScrollView>
      <HelpView style={[screenStyle.container, { alignItems: 'flex-start' }]}>
        
        <View style={serviceScreenStyle.AddServiceButton}>
          <HelpButton
            title={strings.AddServices}
            onPress={() => {}}
            width={screenWidth * 0.9}
            height={screenHeight * 0.05}
          />
        </View>
        <View style={serviceScreenStyle.ServiceCard}>
          <View style={serviceScreenStyle.ImageandTitle}>
            <Text
              style={
                ([
                  fontStyles.darkBlue,
                  fontStyles.bold,
                  fontStyles.mainTextStyle,
                  serviceScreenStyle.BottomSpacer
                ])
              }
            >
               {/* replace with firbase input */}
              Photography
            </Text>
            <Image source={image} style={serviceScreenStyle.imageStyle } />
          </View>

          <View style={serviceScreenStyle.TextPlusButton}>
            <View style={serviceScreenStyle.MiddleText}>
            <Text
              style={
                ([
                  fontStyles.darkBlue,
                  fontStyles.bold,
                  fontStyles.subTextStyle,
                   serviceScreenStyle.BottomSpacer
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
                  serviceScreenStyle.BottomSpacer
                ])
                
              }
            >
               {/* replace with firbase input */}
              $120 per Hour
            </Text>
            </View>
            <View style={serviceScreenStyle.EditButton}>
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

export default serviceScreen;
