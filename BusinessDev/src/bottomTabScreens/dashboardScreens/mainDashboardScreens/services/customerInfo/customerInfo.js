//This is the third step of the product creation product. The business is going to enter the custom questions
//they would want the customers to answer when requesting the process.
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import HelpButton from '../../../../../components/HelpButton/HelpButton';
import TopBanner from '../../../../../components/TopBanner/TopBanner';
import HelpTextInput from '../../../../../components/HelpTextInput/HelpTextInput';
import { screenHeight, screenWidth } from 'config/dimensions';
import strings from 'config/strings';
import { CheckBox } from 'react-native-elements';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import styles from './customerInfoStyle';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import HelpAlert from '../../../../../components/HelpAlert';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import { GiftedAvatar } from 'react-native-gifted-chat';
import HelpView from '../../../../../components/HelpView';
import customerInfoStyle from './customerInfoStyle';

const customerInfo = (props) => {
  const [service, setService] = useState();
  const getData = async () => {
    const service = await FirebaseFunctions.call('getServiceByID', {
      serviceID: 'S0bj90OvpgzjxQDUStYo',
    });
    setService(service);
  };
  const [updateBoolean, setUpdateBoolean] = useState(false);
  const [defaultQuestions, setDefaultQuestions] = useState([
    {
      question: strings.WhatIsYourEmailAddressQuestion,
      title: strings.Email,
      isSelected:
        service &&
        service.questions.includes(strings.WhatIsYourEmailAddressQuestion),
    },
    {
      question: strings.WhatIsYourPhoneNumberQuestion,
      title: strings.PhoneNumber,
      isSelected:
        service &&
        service.questions.includes(strings.WhatIsYourPhoneNumberQuestion),
    },
    {
      question: strings.WhatIsYourAddressQuestion,
      title: strings.Address,
      isSelected:
        service &&
        service.questions.includes(strings.WhatIsYourAddressQuestion),
    },
  ]);
  const [customQuestions, setCustomQuestions] = useState([
    strings.WhatIsYourEmailAddressQuestion,
    strings.WhatIsYourPhoneNumberQuestion,
    strings.WhatIsYourAddressQuestion,
  ]);
  const [emptyQuestionError, setEmptyQuestionError] = useState(false);
  return (
    <HelpView>
      <TopBanner
        title={strings.CustomerInfo}
        leftIconName='angle-left'
        leftOnPress={() => props.navigation.goBack()}
      />
      <KeyboardAwareFlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        extraData={updateBoolean}
        keyExtractor={(item, index) => index + ' '}
        data={customQuestions}
        ListHeaderComponent={
          <View style={styles.customQuestionsContainer}>
            <View style={styles.customQuestionsText}>
              <Text
                style={[
                  fontStyles.bigTextStyle,
                  fontStyles.darkBlue,
                  customerInfoStyle.CustomeQustionsTitle,
                ]}
              >
                {strings.CustomQuestions}
              </Text>
              {/* <View style={styles.textSpacer} /> */}
              <Text
                style={[
                  fontStyles.mainTextStyle,
                  fontStyles.blue,
                  customerInfoStyle.CustomeQuestionsDescription,
                ]}
              >
                {strings.CustomQuestionsDescription}
              </Text>
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={defaultQuestions}
              keyExtractor={(item) => item.question}
              extraData={updateBoolean}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={styles.contactQuestionRow}>
                  <CheckBox
                    onClick={() => {
                      const newDefaultQuestions = defaultQuestions;
                      newDefaultQuestions[
                        index
                      ].isSelected = !newDefaultQuestions[index].isSelected;
                      setDefaultQuestions(newDefaultQuestions);
                      setUpdateBoolean(!updateBoolean); //Used for react to know to update the screen because it can't detect changes to state arrays
                    }}
                    containerStyle={styles.checkboxStyle}
                    checkedColor={colors.darkBlue}
                    checked={item.isSelected}
                    size={40}
                    uncheckedColor={colors.blue}
                    checkedColor={colors.lightBlue}
                  />
                  <HelpButton
                    title={item.title}
                    onPress={() => {
                      const newDefaultQuestions = defaultQuestions;
                      newDefaultQuestions[
                        index
                      ].isSelected = !newDefaultQuestions[index].isSelected;
                      setDefaultQuestions(newDefaultQuestions);
                      setUpdateBoolean(!updateBoolean); //Used for react to know to update the screen because it can't detect changes to state arrays
                    }}
                    isLightButton={!item.isSelected}
                    width={screenWidth * 0.5}
                    height={screenHeight * 0.06}
                  />
                </View>
              )}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.questionContainer}>
            <Text
              style={[
                fontStyles.mainTextStyle,
                fontStyles.darkBlue,
                fontStyles.bold,
                customerInfoStyle.QuestionNumbers,
              ]}
            >
              {strings.Question} #{index + 1}
            </Text>
            <View style={styles.questionSpacer} />
            <View style={styles.textInputRow}>
              <View style={customerInfoStyle.defaultQuestionRow}>
                <HelpTextInput
                  isMultiline={true}
                  width={screenWidth * 0.75}
                  height={screenHeight * 0.15}
                  placeholder={strings.EnterAQuestionForCustomerHere}
                  borderColor={colors.lightBlue}
                  onChangeText={(input) => {
                    const newCustomQuestion = customQuestions;
                    customQuestions[index] = input;
                    setCustomQuestions(newCustomQuestion);
                    setUpdateBoolean(!updateBoolean);
                  }}
                  value={item}
                  maxLength={240}
                />
                <TouchableOpacity
                  style={styles.deleteCustomQuestion}
                  onPress={() => {
                    const newCustomQuestions = customQuestions;
                    newCustomQuestions.splice(index, 1);
                    setCustomQuestions(newCustomQuestions);
                    setUpdateBoolean(!updateBoolean);
                  }}
                >
                  <Icon
                    name={'trash'}
                    type='font-awesome'
                    size={30}
                    color={colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <HelpButton
              title={strings.PlusSign}
              isCircleBlueButton={true}
              bigText={true}
              onPress={() => {
                setCustomQuestions(customQuestions.concat(''));
              }}
            />
            <TouchableOpacity
              style={styles.addQuestion}
              onPress={() => {
                setCustomQuestions(customQuestions.concat(''));
              }}
            >
              <Text
                style={[
                  fontStyles.bigTextStyle,
                  fontStyles.darkBlue,
                  fontStyles.bold,
                ]}
              >
                {strings.AddQuestion}
              </Text>
            </TouchableOpacity>

            <HelpAlert
              isVisible={emptyQuestionError}
              onPress={() => {
                setEmptyQuestionError(false);
              }}
              title={strings.Whoops}
              message={strings.EmptyQuestion}
            />
            <View style={customerInfoStyle.ButtonsView}>
              <View style={customerInfoStyle.BackButton}>
                <HelpButton
                  title={strings.Back}
                  onPress={() => {}}
                  width={screenWidth * 0.25}
                  height={screenHeight * 0.04}
                />
              </View>
              <View style={customerInfoStyle.NextButton}>
                <HelpButton
                  title={strings.Next}
                  onPress={() => {}}
                  width={screenWidth * 0.25}
                  height={screenHeight * 0.04}
                />
              </View>
            </View>
          </View>
        }
      />
    </HelpView>
  );
};

export default customerInfo;
