//This screen will be the one that allows the user to edit the product or to even delete the product
//itself.
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Keyboard, Image } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
import { BoxShadow } from 'react-native-shadow';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OneLineTextInput from '../../components/OneLineTextInput';
import RoundTextInput from '../../components/RoundTextInput';
import ImagePicker from 'react-native-image-picker';
import LoadingSpinner from '../../components/LoadingSpinner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import HelpView from '../../components/HelpView';
import ErrorAlert from '../../components/ErrorAlert';
import ImageWithBorder from '../../components/ImageWithBorder';

class editProductScreen extends Component {

    //The state which will keep track of what the user has entered for the product information
    state = {
        serviceTitle: this.props.navigation.state.params.product.serviceTitle,
        serviceID: this.props.navigation.state.params.productID,
        serviceDescription: this.props.navigation.state.params.product.serviceDescription,
        pricing: this.props.navigation.state.params.product.pricing,
        fieldsError: false,
        isLoading: false,
        isErrorVisible: false
    }

    //Chooses the image from camera roll or picture and sets it to the image source
    chooseImage() {

        Keyboard.dismiss();
        //Shows the image picker with the default options
        ImagePicker.showImagePicker({
            maxHeight: 200,
            maxWidth: 180
        }, (response) => {

            //Retrieves the source of the selected image and sets it to the ImageSource state
            const source = { uri: 'data:image/jpeg;base64,' + response.data };
            if (!(source.uri === "data:image/jpeg;base64,undefined")) {
                //Sets the source of the image if one has been selected
                this.setState({
                    imageSource: source,
                    response
                });
            }

        });
    }

    //Saves the product if any fields have been changed
    async saveProduct() {
        Keyboard.dismiss();
        //Retrieves the state of the input fields
        const { serviceTitle, serviceDescription, pricing, imageSource, response } = this.state;
        const { product, productID, providerID } = this.props.navigation.state.params;

        //Tests if any fields have been changed... if not, then it will just return to the last screen
        if (serviceTitle.trim() === "" || serviceDescription.trim() === "" || pricing.trim() == "") {
            this.setState({ fieldsError: true });
        } else if (serviceTitle === product.serviceTitle &&
            serviceDescription === product.serviceDescription &&
            pricing === product.pricing &&
            (!this.state.response)) {
            this.props.navigation.goBack();
        } else {

            try {
               
                //Updates the correct product corresponding with the correct user
                this.setState({ isLoading: true });
                if (!this.state.response) {
                    await FirebaseFunctions.updateServiceInfo(productID, serviceTitle, serviceDescription, pricing, null);
                } else {
                    await FirebaseFunctions.updateServiceInfo(productID, serviceTitle, serviceDescription, pricing, response);
                }
               
                this.setState({ isLoading: false });
                this.props.navigation.push("ProviderScreens", {
                    providerID
                });
            } catch (error) {
                this.setState({ isLoading: false, isErrorVisible: true });
                FirebaseFunctions.logIssue(error);
            }

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
                            <Text style={fontStyles.mainTextStyleBlack}>{strings.EditTitle}</Text>

                            <View>
                                <OneLineTextInput
                                    onChangeText={(input) => this.setState({ serviceTitle: input })}
                                    value={this.state.serviceTitle}
                                    width={(Dimensions.get('window').width * 0.35)}
                                    maxLength={21}
                                    password={false} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'flex-start' }}>
                                {
                                    (this.state.imageSource ? (
                                        <BoxShadow setting={{
                                            width: (Dimensions.get('window').width * 0.25),
                                            height: (Dimensions.get('window').width * 0.25),
                                            color: colors.gray,
                                            border: 10,
                                            radius: (Dimensions.get('window').width * 0.25) / 2,
                                            opacity: 0.2,
                                            x: 0,
                                            y: 5
                                        }}>
                                            <Image
                                                source={this.state.imageSource}
                                                style={{
                                                    width: Dimensions.get('window').width * 0.25,
                                                    height: (Dimensions.get('window').width * 0.25),
                                                    borderColor: colors.lightBlue,
                                                    borderWidth: (Dimensions.get('window').width * 0.25) / 17,
                                                    borderRadius: (Dimensions.get('window').width * 0.25) / 2
                                                }} />
                                        </BoxShadow>
                                    ) : (
                                            <ImageWithBorder
                                                width={Dimensions.get('window').width * 0.25}
                                                height={Dimensions.get('window').width * 0.25}
                                                imageFunction={async () => {
                                                    //Passes in the function to retrieve the image of this product
                                                    return await FirebaseFunctions.getImageByID(this.state.serviceID)
                                                }} />
                                        ))
                                }

                            </View>
                            <Text> </Text>
                            <View style={{ justifyContent: 'flex-end' }}>
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

                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={fontStyles.mainTextStyleBlack}>
                                {strings.EditDescription}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <RoundTextInput
                                width={Dimensions.get('window').width - 40}
                                height={(Dimensions.get('window').height * 0.14641)}
                                onChangeText={(input) => this.setState({ serviceDescription: input })}
                                value={this.state.serviceDescription}
                                maxLength={240} />
                        </View>
                    </View>
                    <View style={{ flex: 1.5 }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={fontStyles.mainTextStyleBlack}>
                                {strings.EditPrice}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <OneLineTextInput
                                onChangeText={(input) => this.setState({ pricing: input })}
                                value={this.state.pricing}
                                width={Dimensions.get('window').width - 40}
                                password={false}
                                maxLength={50}  />
                        </View>
                    </View>
                    <View style={{ flex: 0.001 }}></View>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <RoundBlueButton
                                title={strings.Done}
                                style={roundBlueButtonStyle.MediumSizeButton}
                                textStyle={fontStyles.bigTextStyleWhite}
                                onPress={() => { this.saveProduct() }}
                                disabled={this.state.isLoading} />
                        </View>

                        <View style={{ flex: 1 }}>
                            <LoadingSpinner isVisible={this.state.isLoading} />
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
            </HelpView>
        )
    }
}

//Exports the screen
export default editProductScreen;