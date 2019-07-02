//This screen will be the one that allows the user to edit the product or to even delete the product
//itself.
import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import fontStyles from 'config/styles/fontStyles';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OneLineTextInput from '../../components/OneLineTextInput';
import RoundTextInput from '../../components/RoundTextInput';
import { BoxShadow } from 'react-native-shadow';
import ImagePicker from 'react-native-image-picker';
import LoadingSpinner from '../../components/LoadingSpinner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import ErrorAlert from '../../components/ErrorAlert';
import colors from 'config/colors';

class editProductScreen extends Component {

    //The state which will keep track of what the user has entered for the product information
    state = {
        serviceTitle: this.props.navigation.state.params.product.serviceTitle,
        serviceDescription: this.props.navigation.state.params.product.serviceDescription,
        pricing: this.props.navigation.state.params.product.pricing,
        imageSource: this.props.navigation.state.params.product.imageSource,
        fieldsError: false,
        isLoading: false,
        isErrorVisible: false
    }

    //Chooses the image from camera roll or picture and sets it to the image source
    chooseImage() {

        //Shows the image picker with the default options
        ImagePicker.showImagePicker(null, (response) => {

            //Retrieves the source of the selected image and sets it to the ImageSource state
            const source = { uri: 'data:image/jpeg;base64,' + response.data };
            if (!(source.uri === "data:image/jpeg;base64,undefined")) {
                //Sets the source of the image if one has been selected
                this.setState({
                    imageSource: source,
                });
            }

        });
    }

    //Saves the product if any fields have been changed
    async saveProduct() {

        //Retrieves the state of the input fields
        const { serviceTitle, serviceDescription, pricing, imageSource } = this.state;
        const { product, productID, providerID } = this.props.navigation.state.params;

        //Tests if any fields have been changed... if not, then it will just return to the last screen
        if (serviceTitle.trim() === "" || serviceDescription.trim() === "" || pricing.trim() == "") {
            this.setState({ fieldsError: true });
        } else if (serviceTitle === product.serviceTitle &&
            serviceDescription === product.serviceDescription &&
            pricing === product.pricing &&
            imageSource === product.imageSource) {
            this.props.navigation.goBack();
        } else {

            try {
                //Updates the correct product corresponding with the correct user
                this.setState({ isLoading: true });
                await FirebaseFunctions.updateServiceInfo(productID, serviceTitle, serviceDescription, pricing, imageSource);
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
            <KeyboardAvoidingView enabled behavior="padding" style={screenStyle.container}>
                <SafeAreaView>
                    <View>
                        <View style={{ flex: 0.1 }}></View>
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
                                        width={140}
                                        password={false} />
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
                                    style={{ justifyContent: 'flex-end' }}>
                                    <Text style={fontStyles.subTextStyleGray}>
                                        {strings.EditImage}</Text>
                                </TouchableOpacity>
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
                                    height={100}
                                    onChangeText={(input) => this.setState({ serviceDescription: input })}
                                    value={this.state.serviceDescription} />
                            </View>
                        </View>
                        <View style={{ flex: 1.25 }}>
                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Text style={fontStyles.mainTextStyleBlack}>
                                    {strings.EditPrice}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <OneLineTextInput
                                    onChangeText={(input) => this.setState({ pricing: input })}
                                    value={this.state.pricing}
                                    width={Dimensions.get('window').width - 40}
                                    password={false} />
                            </View>
                        </View>
                        <View style={{ flex: 0.001 }}></View>
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

                            <View style={{ flex: 1 }}>
                                <RoundBlueButton
                                    title={strings.Done}
                                    style={roundBlueButtonStyle.MediumSizeButton}
                                    textStyle={fontStyles.bigTextStyleWhite}
                                    onPress={() => { this.saveProduct() }} />
                            </View>

                            <View style={{ flex: 1 }}>
                                <LoadingSpinner isVisible={this.state.isLoading} />
                            </View>
                        </View>
                        <View style={{ flex: 1 }}></View>
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
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }
}

//Exports the screen
export default editProductScreen;