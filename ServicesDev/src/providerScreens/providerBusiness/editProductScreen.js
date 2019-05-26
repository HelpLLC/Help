//This screen will be the one that allows the user to edit the product or to even delete the product
//itself.
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
import ImagePicker from 'react-native-image-picker';
import strings from 'config/strings';
import colors from 'config/colors';

class editProductScreen extends Component {

    //The state which will keep track of what the user has entered for the product information
    state = {
        serviceTitle: this.props.product.serviceTitle,
        serviceDescription: this.props.product.serviceDescription,
        pricing: this.props.product.pricing,
        imageSource: this.props.product.imageSource,
        warningMessage: ''
    }

    //Chooses the image from camera roll or picture and sets it to the image source
    chooseImage() {

        //Shows the image picker with the default options
        ImagePicker.showImagePicker(null, (response) => {

            //Retrieves the source of the selected image and sets it to the ImageSource state
            this.setState({
                imageSource: response,
            });

        });
    }

    //Saves the product if any fields have been changed
    saveProduct() {

        //Retrieves the state of the input fields
        const { serviceTitle, serviceDescription, pricing, imageSource } = this.state;

        //Tests if any fields have been changed... if not, then it will just return to the last screen
        if (serviceTitle === this.props.product.serviceTitle &&
            serviceDescription === this.props.product.serviceDescription &&
            pricing === this.props.product.pricing &&
            imageSource === this.props.product.imageSource) {
                this.props.navigation.goBack();
            } else {

                //Creates the newly updated product
                let updatedProduct = {
                    serviceID: this.props.product.serviceID,
                    offeredBy: this.props.product.offeredBy,
                    serviceTitle,
                    serviceDescription, 
                    pricing,
                    imageSource,
                    requests: this.props.product.requests
                };

                //Fethches the index of this product
                const { productID } = this.props;
            
                //Updates the correct product corresponding with the correct user
                this.props.updateProduct(productID, updatedProduct);
                this.props.navigation.goBack();

            }
        
    }

    render() {
        return (
            <SafeAreaView style={screenStyle.container}>
                <View>
                    <TopBanner
                        title={strings.EditService}
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
                            <Text style={fontStyles.mainTextStyleBlack}>{strings.EditTitle}</Text>
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
                                source={this.state.imageSourc.uri}
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

                <Text style={[fontStyles.mainTextStyleBlack, { paddingRight: 180, paddingBottom: 10 }]}>
                    {strings.EditDescription}</Text>

                <RoundTextInput
                    width={Dimensions.get('window').width - 40}
                    height={100}
                    placeholder={strings.EnterDescriptionForCustomersDotDotDot}
                    onChangeText={(input) => this.setState({ serviceDescription: input })}
                    value={this.state.serviceDescription} />

                <Text style={[fontStyles.mainTextStyleBlack, { paddingRight: 240, paddingTop: 20, paddingBottom: 20 }]}>
                    {strings.EditPrice}</Text>

                <OneLineTextInput
                    onChangeText={(input) => this.setState({ pricing: input })}
                    placeholder={strings.HowMuchWillYouChargeDotDotDot}
                    value={this.state.pricing}
                    width={Dimensions.get('window').width - 40} />

                <RoundBlueButton
                    title={strings.Done}
                    style={[roundBlueButtonStyle.MediumSizeButton, { marginTop: 25 }]}
                    textStyle={fontStyles.bigTextStyleWhite}
                    onPress={() => { this.saveProduct() }}
                />

                <View style={{ padding: 20 }}>
                    <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                </View>

            </SafeAreaView>
        )
    }
}

//Exports the screen
export default editProductScreen;