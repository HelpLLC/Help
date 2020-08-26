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
import pricingAndPaymentStyle from './pricingAndPaymentStyle';

const pricingandpayment = (props) => {
  const [price, setPrice] = useState();
  const [per, setPer] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();

  return (
    <HelpView style={[screenStyle.container, { alignItems: 'flex-start' }]}>
      <TopBanner
        title={strings.PricingAndPayment}
        leftIconName='arrow-left'
        size={30}
        leftOnPress={() => props.navigation.goBack()}
      />
      <View style={pricingAndPaymentStyle.PricingTitleView}>
        <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
          {strings.PricingType}
        </Text>
        <View style={pricingAndPaymentStyle.PricingTitleInputsView}>
          <View style={pricingAndPaymentStyle.IconandInputView}>
            <View style={pricingAndPaymentStyle.Icon}>
              <Icon
                name='usd'
                type='font-awesome'
                size={30}
                color={colors.lightBlue}
              />
            </View>
            <HelpTextInput
              height={screenHeight * 0.05}
              width={screenWidth * 0.2}
              borderColor={colors.lightBlue}
              isMultiline={false}
              onChangeText={(input) => setPrice(input)}
            />
          </View>
          <View style={pricingAndPaymentStyle.Per}>
            <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
              {strings.per}
            </Text>
          </View>
          <View>
            <HelpTextInput
              height={screenHeight * 0.05}
              width={screenWidth * 0.35}
              borderColor={colors.lightBlue}
              isMultiline={false}
              placeholder={strings.ExampleHourPlaceholder}
              onChangeText={(input) => setPer(input)}
            />
          </View>
        </View>
      </View>
      <View style={pricingAndPaymentStyle.PaymentTiteleView}>
        <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
          {strings.PaymentType}
        </Text>
        <View style={pricingAndPaymentStyle.PaymentTypeButtons}>
          <View style={pricingAndPaymentStyle.CashButton}>
            <HelpButton
              title={strings.Cash}
              onPress={() => {}}
              width={screenWidth * 0.55}
              height={screenHeight * 0.04}
            />
          </View>
          <HelpButton
            title={strings.CreditDebitCard}
            onPress={() => {}}
            width={screenWidth * 0.55}
            height={screenHeight * 0.04}
          />
        </View>
      </View>
      <View style={pricingAndPaymentStyle.NextButton}>
        <HelpButton
          title={strings.Next}
          onPress={() => {}}

          width={screenWidth * 0.25}
          height={screenHeight * 0.04}
        />
      </View>
      <View style={pricingAndPaymentStyle.BackButton}>
        <HelpButton
          title={strings.Back}
          onPress={() => {}}
          isLightButton={true}
          width={screenWidth * 0.25}
          height={screenHeight * 0.04}
        />
      </View>
    </HelpView>
  );
};

export default pricingandpayment;
