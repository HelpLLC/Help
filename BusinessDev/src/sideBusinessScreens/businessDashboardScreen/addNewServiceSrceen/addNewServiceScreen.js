import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ShadowPropTypesIOS,
} from 'react-native';
import TopBanner from '../../../components/TopBanner/TopBanner';
import HelpView from '../../../components/HelpView';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import colors from '../../../../config/colors';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import ImagePicker from '../../../components/ImagePicker';
import HelpButton from '../../../components/HelpButton/HelpButton';
import { Icon } from 'react-native-elements';
import addNewServiceScreenStyle from './addNewServiceScreenStyle';

const newServiceScreen = (props) => {
  const [serviceTitle, setServiceTitle] = useState();
  const [serviceDescription, setServiceDescription] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [imageSource, setImageSource] = useState('');
  const [imageResponse, setImageResponse] = useState('');
  const [isImagePickerShowing, setIsImagePickerShowing] = useState(false);
  return (
    <HelpView style={[screenStyle.container, { alignItems: 'flex-start' }]}>
      <TopBanner
        title={strings.AddNewService}
        leftIconName='arrow-left'
        size={30}
        leftOnPress={() => props.navigation.goBack()}
      />
      <View>
        <View style={addNewServiceScreenStyle.imageSection}>
          <TouchableOpacity onPress={() => setIsImagePickerShowing(true)}>
            {imageSource === '' ? (
              <View style={addNewServiceScreenStyle.imagePicker}>
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
                style={addNewServiceScreenStyle.imagePicker}
              />
            )}
            <Text
              style={[
                fontStyles.mainTextStyle,
                fontStyles.darkBlue,
                addNewServiceScreenStyle.imageLabel,
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
      <View style={addNewServiceScreenStyle.ServiceTitleView}>
        <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
          {strings.ServiceTitle}
        </Text>
        <View style={addNewServiceScreenStyle.ServiceTitleInput}>
          <HelpTextInput
            height={screenHeight * 0.05}
            width={screenWidth * 0.93}
            borderColor={colors.lightBlue}
            isMultiline={false}
            placeholder={strings.ServiceTitlePlaceholder}
            onChangeText={(input) => setServiceTitle(input)}
          />
        </View>
      </View>
      <View style={addNewServiceScreenStyle.ServiceDescriptionView}>
        <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
          {strings.ServiceDescription}
        </Text>
        <View style={addNewServiceScreenStyle.ServiceDescriptionInput}>
          <HelpTextInput
            height={screenHeight * 0.1}
            width={screenWidth * 0.93}
            borderColor={colors.lightBlue}
            isMultiline={true}
            placeholder={strings.DescriptionPlaceholder}
            onChangeText={(input) => setServiceDescription(input)}
          />
        </View>
      </View>
      <View style={addNewServiceScreenStyle.ServiceDurationView}>
        <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
          {strings.ServiceDuration}
        </Text>
        <View style={addNewServiceScreenStyle.ServiceDurationInputsView}>
          <View style={addNewServiceScreenStyle.DurationHours}>
            <HelpTextInput
              height={screenHeight * 0.05}
              width={screenWidth * 0.2}
              borderColor={colors.lightBlue}
              isMultiline={false}
              onChangeText={(input) => setHours(input)}
            />
            <Text style={[fontStyles.darkBlue, , fontStyles.mainTextStyle]}>
              {strings.Hours}
            </Text>
          </View>
          <View style={addNewServiceScreenStyle.DurationMinutes}>
            <HelpTextInput
              height={screenHeight * 0.05}
              width={screenWidth * 0.2}
              borderColor={colors.lightBlue}
              isMultiline={false}
              onChangeText={(input) => setMinutes(input)}
            />
            <Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
              {strings.Minutes}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <HelpButton
          title={strings.Next}
          onPress={() => {}}
          width={screenWidth * 0.25}
          height={screenHeight * 0.04}
        />
      </View>
    </HelpView>
  );
};

export default newServiceScreen;
