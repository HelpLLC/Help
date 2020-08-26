import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ShadowPropTypesIOS,
} from 'react-native';
import TopBanner from '../../../../../components/TopBanner/TopBanner';
import HelpView from '../../../../../components/HelpView';
import HelpTextInput from '../../../../../components/HelpTextInput/HelpTextInput';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import colors from '../../../../../../config/colors';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpButton from '../../../../../components/HelpButton/HelpButton';
import { Icon } from 'react-native-elements';
import workerManagementStyle from './workerManagementStyle';

const workerManagement = (props) => {
    const [numberOfRequests, setNumberOfRequests] = useState()
  return (
    <HelpView>
      <TopBanner
        title={strings.WorkerManagement}
        leftIconName='angle-left'
        leftOnPress={() => props.navigation.goBack()}
      />
      <View>
        <Text
          style={[
            fontStyles.bold,
            fontStyles.darkBlue,
            fontStyles.mainTextStyle,
            workerManagementStyle.Title,
          ]}
        >
          {strings.SimultaneousRequests}
        </Text>
        <Text
          style={[
            fontStyles.lightBlue,
            fontStyles.subTextStyle,
            workerManagementStyle.Description,
          ]}
        >
          {strings.SimultaneousRequestsMessage}
        </Text>
      </View>
      <View style={workerManagementStyle.TextInputView}>
        <HelpTextInput
          height={screenHeight * 0.05}
          width={screenWidth * 0.2}
          placeholder={strings.NumberPlaceholder}
          borderColor={colors.lightBlue}
          isMultiline={false}
          onChangeText={(input) => setNumberOfRequests(input)}
        />
        <Text style={[fontStyles.bold,fontStyles.darkBlue,fontStyles.subTextStyle,workerManagementStyle.EmployeesText]}>
            {strings.Employees}
        </Text>
      </View>
      <View>
      <View style={workerManagementStyle.NextButton}>
        <HelpButton
          title={strings.Create}
          onPress={() => {}}

          width={screenWidth * 0.25}
          height={screenHeight * 0.04}
        />
      </View>
      <View style={workerManagementStyle.BackButton}>
        <HelpButton
          title={strings.Back}
          onPress={() => {}}
          width={screenWidth * 0.25}
          height={screenHeight * 0.04}
        />
      </View>
      </View>
    </HelpView>
  );
};

export default workerManagement;
