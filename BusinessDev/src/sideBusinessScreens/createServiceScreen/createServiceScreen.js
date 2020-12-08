//This is the screen where the business is first going to create the basic information for the new serivce
//they are creating
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Picker } from 'react-native';
import HelpButton from '../../components/HelpButton/HelpButton';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import { screenHeight, screenWidth } from 'config/dimensions';
import ImagePicker from '../../components/ImagePicker';
import strings from 'config/strings';
import RNPickerSelect from 'react-native-picker-select';
import colors from 'config/colors';
import styles from './createServiceScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import FastImage from 'react-native-fast-image';
import HelpAlert from '../../components/HelpAlert';
import { Icon } from 'react-native-elements';
import addServiceScreenStyle from './createServiceScreenStyle';

//Creates & exports the functional component
const createServiceScreen = (props) => {
  const { service, serviceID, serviceImage } = props.navigation.state.params;
  //All of the state for this screen is declared here
  const [imageSource, setImageSource] = useState('');
  const [imageResponse, setImageResponse] = useState('');
  const [isImagePickerShowing, setIsImagePickerShowing] = useState(false);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceDurationHours, setServiceDurationHours] = useState('');
  const [serviceDurationMinutes, setServiceDurationMinutes] = useState('0');
  const [fieldsError, setFieldsError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [imageError, setImageError] = useState(false);

  //Constucts array of minutes for the duration picker
  const arrayOfNMinutes = [];
  for (let i = 0; i < 60; i++) {
    arrayOfNMinutes.push(i + '');
  }

  //This the method that is called when the component mounts. Sets the screen in firebase, and fetches the data
  //if this service is being edited
  useEffect(() => {
    FirebaseFunctions.setCurrentScreen(
      'BusinessCreateServiceScreen',
      'createServiceScreen'
    );
    if (props.navigation.state.params.editing === true) {
      setData();
    }
  }, []);

  //This method is going to set the data for this screen if this is editing an exisitng prodct
  const setData = () => {
    const theServiceDuration = service.serviceDuration;

    const hours = Math.floor(theServiceDuration) + '';
    const minutes = ((theServiceDuration * 60) % 60) + '';

    setImageSource(serviceImage);
    setServiceTitle(service.serviceTitle);
    setServiceDescription(service.serviceDescription);
    setServiceDurationHours(hours);
    setServiceDurationMinutes(minutes);
  };

  //This function is going to double check that all fields are filled out, the description is of sufficient length
  //and the service duration is of valid length (greater than 0), and that an image has been uploaded. If all
  //that is true, navigates to the next screen. If it is not, then an error message will pop up.
  const goToNextScreen = () => {
    if (
      serviceTitle.trim() === '' ||
      serviceDescription.trim() === '' ||
      (serviceDurationHours.trim() === '' && serviceDurationMinutes === '0')
    ) {
      setFieldsError(true);
    } else if (imageSource === '') {
      setImageError(true);
    } else if (serviceDescription.trim().length < 150) {
      setDescriptionError(true);
    } else {
      const { business, businessID, editing } = props.navigation.state.params;
      //Calculates how many hours this is
      const serviceDuration = (
        parseFloat(serviceDurationHours) +
        parseFloat(serviceDurationMinutes) / 60
      ).toFixed(2);
      props.navigation.push('PricingAndPaymentScreen', {
        business,
        businessID,
        serviceTitle,
        serviceDescription,
        serviceDuration,
        imageResponse,
        serviceID,
        service,
        editing,
      });
    }
  };

  return (
    <HelpView style={[screenStyle.container, { alignItems: 'flex-start' }]}>
      <View>
        <View style={addServiceScreenStyle.imageSection}>
          <TouchableOpacity onPress={() => setIsImagePickerShowing(true)}>
            {imageSource === '' ? (
              <View style={addServiceScreenStyle.imagePicker}>
                <Icon
                  name={'camera'}
                  type={'font-awesome'}
                  size={30}
                  color={colors.gray}
                />
              </View>
            ) : (
              <FastImage
                source={imageSource}
                style={addServiceScreenStyle.imagePicker}
              />
            )}
            <Text
              style={[
                fontStyles.mainTextStyle,
                fontStyles.darkBlue,
                addServiceScreenStyle.imageLabel,
              ]}
            >
              {strings.EditServiceImage}
            </Text>
          </TouchableOpacity>
        </View>
        <ImagePicker
          imageHeight={250}
          onImageCanceled={() => {
            setIsImagePickerShowing(false);
          }}
          imageWidth={screenWidth}
          onImageSelected={(response) => {
            setIsImagePickerShowing(false);
            if (response) {
              const source = { uri: 'data:image/jpeg;base64,' + response.data };
              if (!(source.uri === 'data:image/jpeg;base64,undefined')) {
                //Sets the source of the image if one has been selected
                setImageResponse(response);
                setImageSource(source);
              }
            }
            setIsImagePickerShowing(false);
          }}
          isShowing={isImagePickerShowing}
        />
      </View>
      <View style={addServiceScreenStyle.ServiceTitleView}>
        <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
          {strings.ServiceTitle}
        </Text>
        <View style={addServiceScreenStyle.ServiceTitleInput}>
          <HelpTextInput
            isMultiline={false}
            borderColor={colors.lightBlue}
            height={screenHeight * 0.05}
            width={screenWidth * 0.93}
            placeholder={strings.ServiceTitlePlaceholder}
            onChangeText={(input) => setServiceTitle(input)}
            value={serviceTitle}
            maxLength={21}
          />
        </View>
      </View>
      <View style={addServiceScreenStyle.ServiceDescriptionView}>
        <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
          {strings.ServiceDescription}
        </Text>
        <View style={addServiceScreenStyle.ServiceDescriptionInput}>
          <HelpTextInput
            isMultiline={true}
            height={screenHeight * 0.1}
            width={screenWidth * 0.93}
            borderColor={colors.lightBlue}
            placeholder={strings.DescriptionPlaceholder}
            onChangeText={(input) => setServiceDescription(input)}
            value={serviceDescription}
            maxLength={240}
          />
        </View>
      </View>
      <View style={addServiceScreenStyle.ServiceDurationView}>
        <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
          {strings.ServiceDuration}
        </Text>
        <View style={addServiceScreenStyle.ServiceDurationInputsView}>
          <View style={addServiceScreenStyle.DurationHours}>
            <HelpTextInput
              isMultiline={false}
              height={screenHeight * 0.05}
              width={screenWidth * 0.2}
              borderColor={colors.lightBlue}
              keyboardType={'numeric'}
              placeholder={'0'}
              onChangeText={(input) => setServiceDurationHours(input)}
              value={serviceDurationHours}
            />
            <Text
              style={[
                fontStyles.darkBlue,
                fontStyles.mainTextStyle,
                addServiceScreenStyle.HoursandMinutes,
              ]}
            >
              {strings.Hours}
            </Text>
          </View>
		  <View style={addServiceScreenStyle.DurationMinutes}>
            <HelpTextInput
              height={screenHeight * 0.05}
              width={screenWidth * 0.2}
              borderColor={colors.lightBlue}
              isMultiline={false}
              keyboardType={'numeric'}
              placeholder={'0'}
              value={serviceDurationMinutes}
              onChangeText={(input) => setServiceDurationMinutes(input)}
            />
            <Text
              style={[
                fontStyles.darkBlue,
                fontStyles.mainTextStyle,
                addServiceScreenStyle.HoursandMinutes,
              ]}
            >
              {strings.Minutes}
            </Text>
          </View>
        </View>
      </View>
      <View  style={addServiceScreenStyle.NextButton}>
        <HelpButton
          title={strings.Next}
          width={screenWidth * 0.25}
          height={screenHeight * 0.04}
          bigText={true}
          bold={true}
          onPress={() => {
            //Navigates to the next screen
            goToNextScreen();
          }}
        />
      </View>

      <HelpAlert
        isVisible={fieldsError}
        onPress={() => {
          setFieldsError(false);
        }}
        title={strings.Whoops}
        message={strings.PleaseCompleteAllTheFields}
      />
      <HelpAlert
        isVisible={descriptionError}
        onPress={() => {
          setDescriptionError(false);
        }}
        title={strings.Whoops}
        message={strings.PleaseEnterADescriptionWithAtLeast50Characters}
      />
      <HelpAlert
        isVisible={imageError}
        onPress={() => {
          setImageError(false);
        }}
        title={strings.Whoops}
        message={strings.PleaseAddAnImage}
      />
    </HelpView>
  );
};

export default createServiceScreen;