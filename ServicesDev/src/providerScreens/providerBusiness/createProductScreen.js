//This will be the screen where the user will create a new product. It will be accessed either by
//clicking the plus sign, or clicking create on the business's first product. It will allow the user
//to give the product a picture from their camera roll, and a name and a description and a price
import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import TopBanner from '../../components/TopBanner';
import screenStyle from 'config/styles/screenStyle';
import fontStyles from 'config/styles/fontStyles';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OneLineTextInput from '../../components/OneLineTextInput';
import RoundTextInput from '../../components/RoundTextInput';
import { BoxShadow } from 'react-native-shadow';
import images from 'config/images/images';
import ImagePicker from 'react-native-image-picker';
import Functions from 'config/Functions';
import strings from 'config/strings';
import colors from 'config/colors';
import LoadingSpinner from '../../components/LoadingSpinner';

class createProductScreen extends Component {

    //The state which will keep track of what the user has entered for the product information
    state = {
        serviceTitle: '',
        serviceDescription: '',
        pricing: '',
        imageSource: images.BlankWhite,
        warningMessage: '',
        isLoading: false
    }

    //Chooses the image from camera roll or picture and sets it to the image source
    chooseImage() {

        //Options for the image picker
        const options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose photo from library' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        //Shows the image picker with the default options
        ImagePicker.launchImageLibrary(options, (response) => {

            const source = { uri: 'data:image/jpeg;base64,' + response.data };
            //Sets the source of the image
            this.setState({
                imageSource: source,
            });

        });
    }

    //Creates the product with the entered information to "this" provider
    createProduct() {

        //Retrieves the state of the input fields
        const { serviceTitle, serviceDescription, pricing, imageSource } = this.state;

        //If any of the fields are empty, a warning message will display
        if (serviceTitle.trim() === "" || serviceDescription.trim() === "" || pricing.trim() == "") {
            this.setState({ warningMessage: strings.PleaseCompleteAllTheFields });
        } else if (imageSource === images.BlankWhite) {
            this.setState({ warningMessage: strings.PleaseAddAnImage });
        } else {

            this.setState({ isLoading: true });
            const { providerID, providerProducts, provider } = this.props.navigation.state.params;
            Functions.addProductToDatabase(serviceTitle, serviceDescription, pricing, imageSource, providerID).then((product) => {
                providerProducts.push(product);
                this.props.navigation.push("BusinessScreen", {
                    provider,
                    providerProducts
                });
            });

        }
    }

    render() {
        return (
            <SafeAreaView style={screenStyle.container}>
                <View>
                    <TopBanner
                        title={strings.CreateService}
                        leftIconName="angle-left"
                        leftOnPress={() => this.props.navigation.goBack()} />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: Dimensions.get('window').width - 40,
                    paddingBottom: 20,
                    marginTop: 25
                }}>

                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={fontStyles.mainTextStyleBlack}>{strings.ServiceTitle}</Text>
                        </View>

                        <View>
                            <OneLineTextInput
                                onChangeText={(input) => this.setState({ serviceTitle: input })}
                                placeholder={strings.GiveItATitleDotDotDot}
                                value={this.state.serviceTitle}
                                width={140} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <BoxShadow setting={{
                            width: 140,
                            height: 110,
                            color: colors.gray,
                            border: 10,
                            radius: 50,
                            opacity: 0.2,
                            x: 0,
                            y: 5
                        }}>
                            <Image
                                source={this.state.imageSource}
                                style={{
                                    width: 140,
                                    height: 110,
                                    borderColor: colors.lightBlue,
                                    borderWidth: 6,
                                    borderRadius: 50
                                }} />
                        </BoxShadow>

                        <TouchableOpacity
                            onPress={() => { this.chooseImage() }}
                            style={{ paddingTop: 10 }}>
                            <Text style={fontStyles.subTextStyleGray}>
                                {strings.EditImage}</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <Text style={[fontStyles.mainTextStyleBlack, { paddingRight: 145, paddingBottom: 10 }]}>
                    {strings.ServiceDescription}</Text>

                <RoundTextInput
                    width={Dimensions.get('window').width - 40}
                    height={100}
                    placeholder={strings.EnterDescriptionForCustomersDotDotDot}
                    onChangeText={(input) => this.setState({ serviceDescription: input })}
                    value={this.state.serviceDescription} />

                <Text style={[fontStyles.mainTextStyleBlack, { paddingRight: 270, paddingTop: 20, paddingBottom: 20 }]}>
                    {strings.Pricing}</Text>

                <OneLineTextInput
                    onChangeText={(input) => this.setState({ pricing: input })}
                    placeholder={strings.HowMuchWillYouChargeDotDotDot}
                    value={this.state.pricing}
                    width={Dimensions.get('window').width - 40} />

                <View style={{ padding: 20 }}>
                    <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                </View>

                <RoundBlueButton
                    title={strings.Create}
                    style={[roundBlueButtonStyle.MediumSizeButton, { marginTop: 25 }]}
                    textStyle={fontStyles.bigTextStyleWhite}
                    onPress={() => { this.createProduct() }} />

                <LoadingSpinner isVisible={this.state.isLoading} />

            </SafeAreaView>
        )
    }
}

//Exports the class
export default createProductScreen;