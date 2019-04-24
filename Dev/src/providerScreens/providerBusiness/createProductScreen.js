//This will be the screen where the user will create a new product. It will be accessed either by
//clicking the plus sign, or clicking create on the business's first product. It will allow the user
//to give the product a picture from their camera roll, and a name and a description and a price
import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
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
import { createProviderProduct } from '../../redux/provider/providerActions/createProviderProduct';
import strings from 'config/strings';
import colors from 'config/colors';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class createProductScreen extends Component {

    //The state which will keep track of what the user has entered for the product information
    state = {
        serviceTitle: '',
        serviceDescription: '',
        pricing: '',
        imageSource: images.BlankWhite,
        warningMessage: ''
    }

    //Chooses the image from camera roll or picture and sets it to the image source
    chooseImage() {

        //Shows the image picker with the default options
        ImagePicker.showImagePicker(null, (response) => {

            //Retrieves the source of the selected image and sets it to the ImageSource state
            const source = { uri: response.uri };
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
            
            //Creates the product and adds it to the database
            const newProduct = {
                serviceID: this.props.products.length,
                offeredBy: this.props.provider.providerID,
                serviceTitle,
                serviceDescription,
                pricing,
                imageSource,
                requests: {
                    completedRequests: [],
                    currentRequests: []
                }
            };
            //Updates the redux state by calling the action and passing in the current user's index
            //as well as the new product object
            let { userIndex } = this.props.navigation.state.params; 
            this.props.createProviderProduct(userIndex, newProduct);
            this.props.navigation.goBack();
        }
    }

    render() {
        return (
            <View style={screenStyle.container}>
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

                <RoundBlueButton
                    title={strings.Create}
                    style={[roundBlueButtonStyle.MediumSizeButton, { marginTop: 25 }]}
                    textStyle={fontStyles.bigTextStyleWhite}
                    onPress={() => { this.createProduct() }}
                />

                <View style={{ padding: 20 }}>
                    <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                </View>

            </View>
        )
    }
}

//Connects this screens' props with the current user of the app
const mapStateToProps = (state, props) => {
    const provider = state.providerReducer.accounts[props.navigation.state.params.userIndex];
    const { products } = state.providerReducer;
    return { provider, products };
};

//Connects the screen with the actions that will interact with the database.
//this action will edit the provider's company information
export const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            createProviderProduct,
        },
        dispatch
    );


//connects the screen with the redux persist state
export default connect(mapStateToProps, mapDispatchToProps)(createProductScreen);