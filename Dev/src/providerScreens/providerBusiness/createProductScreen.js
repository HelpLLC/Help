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
import strings from 'config/strings';
import colors from 'config/colors';

class createProductScreen extends Component {

    //The state which will keep track of what the user has entered for the product information
    state = {
        ServiceTitle: '',
        ServiceDescription: '',
        Pricing: '',
        ImageSource: ''
    }

    //Creates the product with the entered information to "this" provider
    createProduct() {

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
                    paddingBottom: 20
                }}>

                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={fontStyles.mainTextStyleBlack}>{strings.ServiceTitle}</Text>
                        </View>

                        <View>
                            <OneLineTextInput
                                onChangeText={(input) => this.setState({ ServiceTitle: input })}
                                placeholder={strings.GiveItATitleDotDotDot}
                                value={this.state.ServiceTitle}
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
                                source={images.BlankWhite}
                                style={{
                                    width: 140,
                                    height: 110,
                                    borderColor: colors.lightBlue,
                                    borderWidth: 6,
                                    borderRadius: 50
                                }} />
                        </BoxShadow>

                        <TouchableOpacity
                            onPress={() => { //Upload from camera roll
                            }}
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
                    onChangeText={(input) => this.setState({ ServiceDescription: input })}
                    value={this.state.ServiceDescription} />

                <Text style={[fontStyles.mainTextStyleBlack, { paddingRight: 270, paddingTop: 20, paddingBottom: 20 }]}>
                    {strings.Pricing}</Text>

                <OneLineTextInput
                    onChangeText={(input) => this.setState({ Pricing: input })}
                    placeholder={strings.HowMuchWillYouChargeDotDotDot}
                    value={this.state.Pricing}
                    width={Dimensions.get('window').width - 40} />

                <RoundBlueButton
                    title={strings.Create}
                    style={[roundBlueButtonStyle.MediumSizeButton, { marginTop: 35 }]}
                    textStyle={fontStyles.bigTextStyleWhite}
                    onPress={() => { this.createProduct() }}
                />

            </View>
        )
    }
}

export default createProductScreen;