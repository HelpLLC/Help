//This will be the screen where the businesses will actually create their profiles & provide info
//such as company name, description etc.
import React, { Component } from 'react';
import { View, Text, Keyboard, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';
import LoadingSpinner from '../components/LoadingSpinner';
import HelpView from '../components/HelpView';
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ErrorAlert from '../components/ErrorAlert';
import firebase from 'react-native-firebase';
import ImageWithBorder from '../components/ImageWithBorder';
import images from 'config/images/images';
import ImagePicker from 'react-native-image-picker';

//The class that will create the look of this screen
class createProviderProfileScreen extends Component {
    componentDidMount() {
        FirebaseFunctions.setCurrentScreen('CreateProviderProfileScreen', 'createProviderProfileScreen');
    }

    //The state containing what the user has typed into each input and whether the screen is loading
    //or not
    state = {
        businessName: '',
        businessInfo: '',
        businessExperience: '',
        businessImage: images.BlankWhite,
        companyNameTakenError: false,
        nameError: false,
        descriptionError: false,
        experienceError: false,
        imageError: false,
        isLoading: false,
        isErrorVisible: false
    };

    //This method will return whether the company name is taken or not (boolean)
    //Checks if the company name is taken by another user or not
    async isCompanyNameTaken(businessName) {
        //Queries the providers to see if a provider exists
        const ref = FirebaseFunctions.providers.where('companyName', '==', businessName);
        const snapshot = await ref.get();

        //If the array contains anything, then the name is taken and true will be returned
        if (snapshot.docs.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    //This method will register the business into the database based on the entered info
    async signUp() {
        //Dismisses the keyboard
        Keyboard.dismiss();
        //If either of the two inputs is empty, an error message will be displayed
        if (this.state.businessName.trim() === '') {
            this.setState({ nameError: true });
        } else if (this.state.businessInfo.trim() === '' || this.state.businessInfo.trim().length < 150) {
            this.setState({ descriptionError: true });
        } else if (this.state.businessExperience.trim() === '' || this.state.businessExperience.trim().length < 100) {
            this.setState({ experienceError: true });
        } else if (this.state.businessImage == images.BlankWhite) {
            this.setState({ imageError: true });
        } else {
            this.setState({ isLoading: true });

            const { email, password } = this.props.navigation.state.params;
            const { businessName, businessInfo, businessExperience, businessImage } = this.state;

            //If the business name is already taken, then a warning message will appear,
            //Else, the profile will be created
            try {
                firebase.auth().signInAnonymously();
                const isCompanyNameTaken = await this.isCompanyNameTaken(businessName);
                if (isCompanyNameTaken === true) {
                    this.setState({ companyNameTakenError: true, isLoading: false });
                } else {
                    //Creates the account and then navigates to the correct screens while passing in
                    //the correct params and logs in
                    const account = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    const provider = await FirebaseFunctions.addProviderToDatabase(account, email, businessName, businessInfo, businessExperience, businessImage);
                    await FirebaseFunctions.logIn(email, password);
                    //Navigates to the screen where it tells the business to wait until their account has been verified
                    this.props.navigation.push('AccountNotVerifiedScreen');
                }
            } catch (error) {
                this.setState({ isLoading: false, isErrorVisible: true });
                FirebaseFunctions.logIssue(error, 'CreateProviderProfileScreen');
            }
        }
    }

    render() {
        return (
            <HelpView style={screenStyle.container}>
                <ScrollView>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                                this.chooseImage();
                            }}
                            style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View
                                style={{
                                    flex: 0.5,
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                }}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <BoxShadow
                                        setting={{
                                            width: Dimensions.get('window').width * 0.25,
                                            height: Dimensions.get('window').width * 0.25,
                                            color: colors.gray,
                                            border: 10,
                                            radius: (Dimensions.get('window').width * 0.25) / 2,
                                            opacity: 0.2,
                                            x: 0,
                                            y: 5
                                        }}>
                                        <Image
                                            source={this.state.businessImage}
                                            style={{
                                                width: Dimensions.get('window').width * 0.25,
                                                height: Dimensions.get('window').width * 0.25,
                                                borderColor: colors.lightBlue,
                                                borderWidth: (Dimensions.get('window').width * 0.25) / 17,
                                                borderRadius: (Dimensions.get('window').width * 0.25) / 2
                                            }}
                                        />
                                    </BoxShadow>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', alignSelf: 'center', }}>
                                <Text style={fontStyles.mainTextStyleBlue}>{strings.EditImage}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 0.5,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            alignItems: 'center'
                        }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={fontStyles.bigTextStyleBlack}>{strings.WhatsYourBusinessCalledQuestion}</Text>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <OneLineRoundedBoxInput
                                placeholder={strings.EnterCompanyNameDotDotDot}
                                onChangeText={(input) => this.setState({ businessName: input })}
                                value={this.state.businessName}
                                password={false}
                                maxLength={20}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 0.5,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            alignItems: 'center',
                            marginTop: 15
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={fontStyles.bigTextStyleBlack}>{strings.WhatDoesYourBusinessDoQuestion}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <MultiLineRoundedBoxInput
                                width={Dimensions.get('window').width * 0.669}
                                height={Dimensions.get('window').height * 0.14641}
                                placeholder={strings.TellYourCustomersAboutYourselfDotDotDot}
                                onChangeText={(input) => this.setState({ businessInfo: input })}
                                value={this.state.businessInfo}
                                maxLength={350}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 0.5,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            alignItems: 'center',
                            marginTop: 15
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={fontStyles.bigTextStyleBlack}>{strings.WhatIsYourBusinessExperienceQuestion}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <MultiLineRoundedBoxInput
                                width={Dimensions.get('window').width * 0.669}
                                height={Dimensions.get('window').height * 0.14641}
                                placeholder={strings.TellYourCustomersAboutYourExperienceDotDotDot}
                                onChangeText={(input) => this.setState({ businessExperience: input })}
                                value={this.state.businessExperience}
                                maxLength={350}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', marginTop: 15 }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <RoundBlueButton
                                title={strings.GetStarted}
                                style={roundBlueButtonStyle.MediumSizeButton}
                                textStyle={fontStyles.bigTextStyleWhite}
                                onPress={() => {
                                    this.signUp();
                                }}
                                disabled={this.state.isLoading}
                            />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <LoadingSpinner isVisible={this.state.isLoading} />
                        </View>
                    </View>
                    <ErrorAlert
                        isVisible={this.state.isErrorVisible}
                        onPress={() => {
                            this.setState({ isErrorVisible: false });
                        }}
                        title={strings.Whoops}
                        message={strings.SomethingWentWrong}
                    />
                    <ErrorAlert
                        isVisible={this.state.nameError}
                        onPress={() => {
                            this.setState({ nameError: false });
                        }}
                        title={strings.Whoops}
                        message={strings.PleaseEnterACompanyName}
                    />
                    <ErrorAlert
                        isVisible={this.state.descriptionError}
                        onPress={() => {
                            this.setState({ descriptionError: false });
                        }}
                        title={strings.Whoops}
                        message={strings.PleaseEnterADescriptionWithAtLeast150Characters}
                    />
                    <ErrorAlert
                        isVisible={this.state.imageError}
                        onPress={() => {
                            this.setState({ imageError: false });
                        }}
                        title={strings.Whoops}
                        message={strings.PleaseChooseAValidImage}
                    />
                    <ErrorAlert
                        isVisible={this.state.experienceError}
                        onPress={() => {
                            this.setState({ experienceError: false });
                        }}
                        title={strings.Whoops}
                        message={strings.PleaseEnterYourWorkExperienceWithAtLeast100Characters}
                    />
                    <ErrorAlert
                        isVisible={this.state.companyNameTakenError}
                        onPress={() => {
                            this.setState({ companyNameTakenError: false });
                        }}
                        title={strings.Whoops}
                        message={strings.CompanyNameTakenPleaseChooseAnotherName}
                    />
                </ScrollView>
            </HelpView >
        );
    }
    //Chooses the image from camera roll or picture and sets it to the image source
    chooseImage() {
        Keyboard.dismiss();
        //Shows the image picker with the default options
        ImagePicker.showImagePicker(
            {
                maxHeight: 200,
                maxWidth: 180
            },
            (response) => {
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
                if (!(source.uri === 'data:image/jpeg;base64,undefined')) {
                    //Sets the source of the image if one has been selected
                    this.setState({
                        businessImage: source,
                        response
                    });
                }
            }

        );
    }
}

//exports the screen
export default createProviderProfileScreen;
