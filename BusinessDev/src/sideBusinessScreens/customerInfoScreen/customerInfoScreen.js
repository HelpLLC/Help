//This is the third step of the product creation product. The business is going to enter the custom questions
//they would want the customers to answer when requesting the process.
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import HelpButton from '../../components/HelpButton/HelpButton';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import { screenHeight, screenWidth } from 'config/dimensions';
import strings from 'config/strings';
import { CheckBox } from 'react-native-elements';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import styles from './customerInfoScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import HelpAlert from '../../components/HelpAlert';
import HelpView from '../../components/HelpView';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import customerInfoStyle from './customerInfoScreenStyle';

//Creates and exports the functional component
const customerInfoScreen = (props) => {
  const { service, serviceID } = props.navigation.state.params;
  //The state declarations that will be used in this screen
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
  const [customQuestions, setCustomQuestions] = useState([]);
  const [emptyQuestionError, setEmptyQuestionError] = useState(false);
  const [updateBoolean, setUpdateBoolean] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //This the method that is called when the component mounts. Sets the screen in firebase, and fetches the data
  //if this service is being edited
  useEffect(() => {
    FirebaseFunctions.setCurrentScreen(
      'BusinessCreateCustomerInfoScreen',
      'customerInfoScreen'
    );
    if (props.navigation.state.params.editing === true) {
      setData();
    }
  }, []);

  //This method is going to set the data for this screen if this is editing an exisitng prodct
  const setData = () => {
    const { questions } = service;
    //Removes the default questions from the questions array
    if (questions.includes(strings.WhatIsYourEmailAddressQuestion)) {
      questions.splice(
        questions.indexOf(strings.WhatIsYourEmailAddressQuestion),
        1
      );
    }
    if (questions.includes(strings.WhatIsYourPhoneNumberQuestion)) {
      questions.splice(
        questions.indexOf(strings.WhatIsYourPhoneNumberQuestion),
        1
      );
    }
    if (questions.includes(strings.WhatIsYourAddressQuestion)) {
      questions.splice(questions.indexOf(strings.WhatIsYourAddressQuestion), 1);
    }
    if (questions.length > 0) {
      setCustomQuestions(questions);
    }
  };

    //This method will capture all of the data from this screen, make sure it is completed, then capture all the data
  //from the previous step, then pass it on to the next screen. If the fields from here are incomplete, then an error will
  //be displayed to the user
  const goToNextScreen = () => {

    for (const customQuestion of customQuestions.slice(1)) {
      if (customQuestion.trim() === '') {
        setEmptyQuestionError(true);
        setIsLoading(false);
        return;
      }
    }

    let finalQuestions = [];
    for (const defaultQuestion of defaultQuestions) {
      if (defaultQuestion.isSelected) {
        finalQuestions.push(defaultQuestion.question);
      }
    }

    finalQuestions = customQuestions.concat(finalQuestions);
    if (finalQuestions[0].trim() === '') {
      finalQuestions.splice(0, 1);
    }

      const {
        business,
        businessID,
        serviceTitle,
        serviceDescription,
        priceText,
        price,
        isCardSelected,
        isCashSelected,
        serviceDuration,
        imageResponse,
        editing,
      } = props.navigation.state.params;
      props.navigation.push('WorkerManagement', {
        business,
        businessID,
        serviceTitle,
        serviceDescription,
        serviceDuration,
        imageResponse,
        priceText,
        price,
        questions: finalQuestions,
        isCardSelected,
        isCashSelected,
        service,
        serviceID,
        editing,
      });
  };



  //Renders the UI
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
                  width={screenWidth * 0.25}
                  height={screenHeight * 0.04}
                  isLoading={isLoading}
                  disabled={isLoading}
                  bigText={true}
                  bold={true}
                  onPress={() => {
                    //Navigates to the previous screen
                    props.navigation.goBack();
                  }}
                />
              </View>
              <View style={customerInfoStyle.NextButton}>
                <HelpButton
                  title={strings.Next}
                  width={screenWidth * 0.25}
                  height={screenHeight * 0.04}
                  isLoading={isLoading}
                  disabled={isLoading}
                  bigText={true}
                  bold={true}
                  onPress={() => {
                    //Navigates to the next screen
                    goToNextScreen();
                  }}
                />
              </View>
            </View>
          </View>
        }
      />
    </HelpView>
  );
};

export default customerInfoScreen;
