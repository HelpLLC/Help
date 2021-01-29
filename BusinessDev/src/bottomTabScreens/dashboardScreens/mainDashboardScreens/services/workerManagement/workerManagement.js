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
import HelpAlert from '../../../../../components/HelpAlert';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { Icon } from 'react-native-elements';
import workerManagementStyle from './workerManagementStyle';

const workerManagement = (props) => {
  const { service, editing, serviceID } = props.navigation.state.params;
  const [
    numberOfSimultaneousRequests,
    setNumberOfSimultaneousRequests,
  ] = useState();
  const [fieldsError, setFieldsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //This the method that is called when the component mounts. Sets the screen in firebase, and fetches the data
  //if this service is being edited
  useEffect(() => {
    FirebaseFunctions.setCurrentScreen(
      'BusinessCreateCustomerInfoScreen',
      'customerInfoScreen'
    );
    if (editing === true) {
      setData();
    }
  }, []);

  //This method is going to set the data for this screen if this is editing an exisitng prodct
  const setData = () => {
    const {simultaneousRequests} = service;

    const numberRequests = Math.floor(simultaneousRequests);

    setNumberOfSimultaneousRequests(numberRequests);
  };

  //The method will check that there are no empty questions. If there are, an error will pop up. If there are, then
  //an error will pop up. If there aren't, it will construct the questions array and then get the previously created
  //information and then create the service in firestore or edit it if this is an existing service
  const saveService = async () => {
    setIsLoading(true);
    let finalNumberOfSimultaneousRequests
    if (numberOfSimultaneousRequests.trim() === '') {
      setFieldsError(true);
    } else {
       finalNumberOfSimultaneousRequests = numberOfSimultaneousRequests;
    }

    const {
      business,
      businessID,
      serviceTitle,
      serviceDescription,
      serviceDuration,
      imageResponse,
      priceText,
      finalQuestions,
      price,
      isCardSelected,
      isCashSelected,
    } = props.navigation.state.params;

    //If the service is being edited, then the information will be updated. If it is new, it will be created
    if (editing === true) {
      await FirebaseFunctions.call('updateServiceInformation', {
        priceText,
        serviceDuration: parseFloat(serviceDuration),
        price,
        questions: finalQuestions,
        finalNumberOfSimultaneousRequests,
        serviceDescription,
        serviceTitle,
        serviceID,
        businessID,
        card: isCardSelected,
        cash: isCashSelected,
      });

      if (imageResponse !== '') {
        //Handles the logic for uploading the image to Firebase
        //Fetches the absolute path of the image (depending on android or ios)
        let absolutePath = '';
        if (Platform.OS === 'android') {
          absolutePath = 'file://' + imageResponse.path;
        } else {
          absolutePath = imageResponse.path;
        }
        //Creates the reference & uploads the image (async)
        await FirebaseFunctions.storage
          .ref('services/' + serviceID)
          .putFile(absolutePath);
      }
    } else {
      //Adds the product to the database & upload the image to Firebase Storage
      const serviceID = await FirebaseFunctions.call('addServiceToDatabase', {
        averageRating: 0,
        businessID,
        businessName: business.businessName,
        category: 'Cleaning',
        coordinates: business.coordinates,
        displayedReviews: [],
        serviceDuration: parseFloat(serviceDuration),
        price,
        priceText,
        finalNumberOfSimultaneousRequests,
        questions: finalQuestions,
        serviceDescription,
        serviceTitle,
        totalReviews: 0,
        cash: isCashSelected,
        card: isCardSelected,
      });
      //Handles the logic for uploading the image to Firebase
      //Fetches the absolute path of the image (depending on android or ios)
      let absolutePath = '';
      if (Platform.OS === 'android') {
        absolutePath = 'file://' + imageResponse.path;
      } else {
        absolutePath = imageResponse.path;
      }
      //Creates the reference & uploads the image (async)
      await FirebaseFunctions.storage
        .ref('services/' + serviceID)
        .putFile(absolutePath);
    }

    setIsLoading(false);
    props.navigation.push('BusinessScreens', {
      businessID,
    });
  };
  return (
    <HelpView>
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
          onChangeText={(input) => setNumberOfSimultaneousRequests(input)}
          value={numberOfSimultaneousRequests}
        />
        <Text
          style={[
            fontStyles.bold,
            fontStyles.darkBlue,
            fontStyles.subTextStyle,
            workerManagementStyle.EmployeesText,
          ]}
        >
          {strings.Employees}
        </Text>
      </View>
      <View>
        <View style={workerManagementStyle.NextButton}>
          <HelpButton
            title={editing ? strings.Done : strings.Create}
            width={screenWidth * 0.25}
            height={screenHeight * 0.04}
            isLoading={isLoading}
            disabled={isLoading}
            bigText={true}
            bold={true}
            onPress={() => {
              //Navigates to the next screen
              saveService();
            }}
          />
        </View>
        <View style={workerManagementStyle.BackButton}>
          <HelpButton
            title={strings.Back}
            onPress={() => {}}
            width={screenWidth * 0.25}
            height={screenHeight * 0.04}
            bigText={true}
            bold={true}
            onPress={() => {
              //Navigates to the previous screen
              props.navigation.goBack();
            }}
          />
        </View>
      </View>
      <HelpAlert
        isVisible={fieldsError}
        onPress={() => {
          setFieldsError(false);
        }}
        title={strings.Whoops}
        message={strings.PleaseCompleteAllTheFields}
      />
    </HelpView>
  );
};

export default workerManagement;
