import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import TopBanner from '../../../components/TopBanner/TopBanner';
import HelpView from '../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpButton from '../../../components/HelpButton/HelpButton';
import style from './employeeProfileScreenStyle';
import ServiceInfoCard from '../../../components/ServiceInfoCard/ServiceInfoCard';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';

const employeeProfileScreen = (props) => {
  const options = [
    strings.ProfileCompanyInfo,
    strings.ProfileBusinessSchedule,
    strings.ProfilePassword,
    strings.ProfileLogout,
  ];

  function renderOptions() {
    let elements = [];
    for (let i in options)
      elements.push(
        <TouchableOpacity
          style={
            options[i] == strings.ProfileLogout ? style.LogoutPositioning : null
          }
          key={options[i]}
        >
          <View
            style={[
              style.OptionContainer,
              options[i] == strings.ProfileLogout
                ? style.LogoutContainer
                : style.OptionNormal,
            ]}
          >
            <Text
              style={[
                fontStyles.mainTextStyle,
                style.OptionText,
                options[i] == strings.ProfileLogout ? style.LogoutText : {},
              ]}
            >
              {options[i]}
            </Text>
            {options[i] == strings.ProfileLogout ? null : (
              <Icon
                name={'angle-right'}
                type='font-awesome'
                size={25}
                color={
                  options[i] == strings.ProfileLogout
                    ? colors.white
                    : colors.darkBlue
                }
              />
            )}
          </View>
        </TouchableOpacity>
      );
    return elements;
  }

  return (
    <HelpView>
      <TopBanner
        title={strings.Dashboard}
        size={30}
        leftOnPress={() => props.navigation.goBack()}
      />
      <View style={style.Body}>
        <View style={style.ContentContainer}>
          <View style={style.MainContainer}>
            <Image
              source={require('../../../bottomTabScreens/profile/profileScreen/profilePicture.png')}
              style={{ width: 100, height: 100, margin: 10 }}
            />
            <Text style={[fontStyles.mainTextStyle, style.MainText]}>
              Employee
            </Text>
          </View>
          {renderOptions()}
        </View>
      </View>
    </HelpView>
  );
};

export default employeeProfileScreen;
