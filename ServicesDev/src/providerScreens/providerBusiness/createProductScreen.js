//This will be the screen where the user will create a new product. It will be accessed either by
//clicking the plus sign, or clicking create on the business's first product. It will allow the user
//to give the product a picture from their camera roll, and a name and a description and a price
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Keyboard } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OneLineTextInput from '../../components/OneLineTextInput';
import HelpView from '../../components/HelpView';
import RoundTextInput from '../../components/RoundTextInput';
import images from 'config/images/images';
import ImagePicker from 'react-native-image-picker';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import ImageWithBorder from '../../components/ImageWithBorder';

class createProductScreen extends Component {

    //The state which will keep track of what the user has entered for the product information
    state = {
        serviceTitle: '',
        serviceDescription: '',
        pricing: '',
        imageSource: images.BlankWhite,
        isLoading: false,
        isErrorVisible: false,
        fieldsError: false,
        imageError: false
    }

    //Chooses the image from camera roll or picture and sets it to the image source
    chooseImage() {

        Keyboard.dismiss();
        //Shows the image picker with the default options
        ImagePicker.showImagePicker(null, (response) => {

            const source = { uri: 'data:image/jpeg;base64,' + response.data };
            if (!(source.uri === "data:image/jpeg;base64,undefined")) {
                //Sets the source of the image if one has been selected
                this.setState({
                    imageSource: source,
                });
            }


        });
    }

    //Creates the product with the entered information to "this" provider
    async createProduct() {

        Keyboard.dismiss();
        //Retrieves the state of the input fields
        const { serviceTitle, serviceDescription, pricing, imageSource } = this.state;
        const { provider } = this.props.navigation.state.params;

        //If any of the fields are empty, a warning message will display
        if (serviceTitle.trim() === "" || serviceDescription.trim() === "" || pricing.trim() == "") {
            this.setState({ fieldsError: true });
        } else if (imageSource === images.BlankWhite) {
            this.setState({ imageError: true });
        } else {
            try {
                this.setState({ isLoading: true });
                const { providerID } = this.props.navigation.state.params;
                await FirebaseFunctions.addProductToDatabase(serviceTitle, serviceDescription, pricing, imageSource, providerID, provider.companyName);
                this.setState({ isLoading: false });
                this.props.navigation.push("ProviderScreens", {
                    providerID: provider.providerID
                });
            } catch (error) {
                this.setState({ isLoading: false, isErrorVisible: true });
                FirebaseFunctions.logIssue(error);
            }
            return 0;
        }
    }

    render() {
        return (
            <HelpView style={screenStyle.container}>
                <View>
                    <View style={{ flex: 0.25 }}></View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: Dimensions.get('window').width - 40,
                        flex: 1,
                        alignItems: 'center'
                    }}>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={fontStyles.mainTextStyleBlack}>{strings.ServiceTitle}</Text>

                            <View>
                                <OneLineTextInput
                                    onChangeText={(input) => this.setState({ serviceTitle: input })}
                                    placeholder={strings.GiveItATitleDotDotDot}
                                    value={this.state.serviceTitle}
                                    password={false}
                                    width={Dimensions.get('window').width * 0.3406} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <ImageWithBorder
                                width={Dimensions.get('window').width * 0.33}
                                height={Dimensions.get('window').height * 0.16}
                                imageSource={this.state.imageSource} />
                            <TouchableOpacity
                                onPress={() => {
                                    Keyboard.dismiss();
                                    this.chooseImage();
                                }}
                                style={{ justifyContent: 'flex-end' }}>
                                <Text style={fontStyles.subTextStyleGray}>
                                    {strings.EditImage}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={fontStyles.mainTextStyleBlack}>
                                {strings.ServiceDescription}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <RoundTextInput
                                width={Dimensions.get('window').width - 40}
                                height={100}
                                placeholder={strings.EnterDescriptionForCustomersDotDotDot}
                                onChangeText={(input) => this.setState({ serviceDescription: input })}
                                value={this.state.serviceDescription} />
                        </View>
                    </View>
                    <View style={{ flex: 1.5 }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={fontStyles.mainTextStyleBlack}>
                                {strings.Pricing}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <OneLineTextInput
                                onChangeText={(input) => this.setState({ pricing: input })}
                                placeholder={strings.HowMuchWillYouChargeDotDotDot}
                                value={this.state.pricing}
                                password={false}
                                width={Dimensions.get('window').width - 40} />
                        </View>
                    </View>
                    <View style={{ flex: 0.001 }}></View>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <RoundBlueButton
                                    title={strings.Create}
                                    style={roundBlueButtonStyle.MediumSizeButton}
                                    textStyle={fontStyles.bigTextStyleWhite}
                                    onPress={async () => {
                                        await this.createProduct();
                                    }} />
                            </View>
                            <View style={{ flex: 0.5 }}></View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <LoadingSpinner isVisible={this.state.isLoading} />
                            </View>
                        </View>

                    </View>
                    <View style={{ flex: 0.8 }}></View>
                </View>
                <ErrorAlert
                    isVisible={this.state.isErrorVisible}
                    onPress={() => { this.setState({ isErrorVisible: false }) }}
                    title={strings.Whoops}
                    message={strings.SomethingWentWrong}
                />
                <ErrorAlert
                    isVisible={this.state.fieldsError}
                    onPress={() => { this.setState({ fieldsError: false }) }}
                    title={strings.Whoops}
                    message={strings.PleaseCompleteAllTheFields}
                />
                <ErrorAlert
                    isVisible={this.state.imageError}
                    onPress={() => { this.setState({ imageError: false }) }}
                    title={strings.Whoops}
                    message={strings.PleaseAddAnImage}
                />
            </HelpView>
        )
    }
}

//Exports the class
export default createProductScreen;