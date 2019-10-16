//This screen will be the product editing screen where the business will either create a new product
//or edit an old one, depending on where the screen will be accessed from
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Keyboard, Image } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import RoundBlueButton from '../../components/RoundBlueButton';
import RNPickerSelect from 'react-native-picker-select';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OneLineRoundedBoxInput from '../../components/OneLineRoundedBoxInput';
import { BoxShadow } from 'react-native-shadow';
import HelpView from '../../components/HelpView';
import MultiLineRoundedBoxInput from '../../components/MultiLineRoundedBoxInput';
import images from 'config/images/images';
import ImagePicker from 'react-native-image-picker';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import ImageWithBorder from '../../components/ImageWithBorder';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';

class createProductScreen extends Component {

    state = {
        isScreenLoading: true
    }

    //This componentWillMount method will decide, based on the params that are passed in, whether
    //this screen is going to edit a product or create a new one.
    async componentDidMount() {

        if (this.props.navigation.state.params && this.props.navigation.state.params.product) {

            FirebaseFunctions.setCurrentScreen("EditProductScreen", "editProductScreen");

            //This means that this screen is an editing screen
            const { product, productID } = this.props.navigation.state.params;

            this.setState({
                serviceTitle: product.serviceTitle,
                serviceID: productID,
                serviceDescription: product.serviceDescription,
                imageSource: images.BlankWhite,
                isLoading: false,
                isScreenLoading: true,
                isErrorVisible: false,
                fieldsError: false,
                serviceDescriptionError: false,
                imageError: false,
                priceType: product.price.priceType,
                pricePerNumber: '',
                pricePerText: '',
                priceMin: '',
                priceMax: ''
            });

            //Sets the correct price type
            if (product.price.priceType === 'per') {
                this.setState({
                    pricePerNumber: product.price.price + '',
                    pricePerText: product.price.per,
                    isScreenLoading: false
                });
            } else {
                this.setState({
                    priceMin: product.price.min + '',
                    priceMax: product.price.max + '',
                    isScreenLoading: false
                });
            }

        } else {

            FirebaseFunctions.setCurrentScreen("CreateProductScreen", "createProductScreen");
            //This means that this screen is going to create a new product
            this.setState({
                serviceTitle: '',
                serviceDescription: '',
                imageSource: images.BlankWhite,
                isLoading: false,
                isScreenLoading: false,
                isErrorVisible: false,
                fieldsError: false,
                serviceDescriptionError: false,
                imageError: false,
                priceType: 'per',
                pricePerNumber: '',
                pricePerText: '',
                priceMin: '',
                priceMax: ''
            });

        }

    }

    //Chooses the image from camera roll or picture and sets it to the image source
    chooseImage() {

        Keyboard.dismiss();
        //Shows the image picker with the default options
        ImagePicker.showImagePicker({
            maxHeight: 200,
            maxWidth: 180
        }, (response) => {

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

    //Creates the product with the entered information to "this" provider
    async createProduct() {

        Keyboard.dismiss();
        //Retrieves the state of the input fields
        const { serviceTitle, serviceDescription, imageSource, response, priceType } = this.state;
        const { provider } = this.props.navigation.state.params;

        //If any of the fields are empty, a warning message will display
        if (serviceTitle.trim() === "" || serviceDescription.trim() === "" ||
            (priceType === 'per' && (this.state.pricePerNumber === '' || this.state.pricePerText.trim() === "")) ||
            (priceType === 'range' && (this.state.priceMax === '' || this.state.priceMin === ''))) {
            this.setState({ fieldsError: true });
        } else if (serviceDescription.trim().length < 150) {
            this.setState({ serviceDescriptionError: true });
        } else if (imageSource === images.BlankWhite) {
            this.setState({ imageError: true });
        } else {
            try {
                this.setState({ isLoading: true });
                //Creates the price object
                const price = {
                    priceType
                }
                if (priceType === 'per') {
                    price.price = parseFloat(this.state.pricePerNumber);
                    price.per = this.state.pricePerText;
                } else {
                    price.min = parseFloat(this.state.priceMin);
                    price.max = parseFloat(this.state.priceMax);
                }
                const { providerID } = this.props.navigation.state.params;
                await FirebaseFunctions.addProductToDatabase(serviceTitle, serviceDescription, price, response, providerID, provider.companyName);
                this.setState({ isLoading: false });
                this.props.navigation.push("ProviderScreens", {
                    providerID: provider.providerID
                });
            } catch (error) {
                this.setState({ isLoading: false, isErrorVisible: true });
                FirebaseFunctions.logIssue(error, {
                    screen: 'CreateProductScreen',
                    userID: 'p-' + provider.providerID
                });
            }
            return 0;
        }
    }

    //Saves the product if any fields have been changed
    async saveProduct() {
        Keyboard.dismiss();
        //Retrieves the state of the input fields
        const { serviceTitle, serviceDescription, priceType, imageSource, response } = this.state;
        const { productID, providerID } = this.props.navigation.state.params;

        if (serviceTitle.trim() === "" || serviceDescription.trim() === "" ||
            (priceType === 'per' && (this.state.pricePerNumber === '' || this.state.pricePerText.trim() === "")) ||
            (priceType === 'range' && (this.state.priceMax === '' || this.state.priceMin === ''))) {
            this.setState({ fieldsError: true });
        } else if (serviceDescription.trim().length < 150) {
            this.setState({ serviceDescriptionError: true });
        } else {

            try {

                //Updates the correct product corresponding with the correct user
                this.setState({ isLoading: true });

                //Creates the price object
                const price = {
                    priceType
                }
                if (priceType === 'per') {
                    price.price = parseFloat(this.state.pricePerNumber);
                    price.per = this.state.pricePerText;
                } else {
                    price.min = parseFloat(this.state.priceMin);
                    price.max = parseFloat(this.state.priceMax);
                }

                if (!this.state.response) {
                    await FirebaseFunctions.updateServiceInfo(productID, serviceTitle, serviceDescription, price, null);
                } else {
                    await FirebaseFunctions.updateServiceInfo(productID, serviceTitle, serviceDescription, price, response);
                }

                this.setState({ isLoading: false });
                this.props.navigation.push("ProviderScreens", {
                    providerID
                });
            } catch (error) {
                this.setState({ isLoading: false, isErrorVisible: true });
                FirebaseFunctions.logIssue(error, {
                    screen: 'EditProductScreen',
                    userID: 'p-' + providerID,
                    productID: productID
                });
            }

        }
    }

    render() {

        if (this.state.isScreenLoading === true) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner isVisible={true} />
                </View>
            )
        }

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
                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Text style={fontStyles.bigTextStyleBlack}>{strings.ServiceTitle}</Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <OneLineRoundedBoxInput
                                    onChangeText={(input) => this.setState({ serviceTitle: input })}
                                    placeholder={strings.GiveItATitleDotDotDot}
                                    value={this.state.serviceTitle}
                                    password={false}
                                    maxLength={21}
                                    width={Dimensions.get('window').width * 0.35} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    Keyboard.dismiss();
                                    this.chooseImage();
                                }}
                                style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ justifyContent: 'flex-start' }}>
                                    {this.state.serviceID ? (
                                        <ImageWithBorder
                                            width={Dimensions.get('window').width * 0.25}
                                            height={Dimensions.get('window').width * 0.25}
                                            imageFunction={async () => {
                                                //Passes in the function to retrieve the image of this product
                                                return await FirebaseFunctions.getImageByID(this.state.serviceID)
                                            }} />
                                    ) : (
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
                                        )}

                                </View>
                                <Text> </Text>
                                <View style={{ justifyContent: 'flex-end' }}>
                                    <Text style={fontStyles.mainTextStyleBlue}>
                                        {strings.EditImage}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={fontStyles.bigTextStyleBlack}>
                                {strings.ServiceDescription}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <MultiLineRoundedBoxInput
                                width={Dimensions.get('window').width - 40}
                                height={(Dimensions.get('window').height * 0.14641)}
                                placeholder={strings.EnterDescriptionForCustomersDotDotDot}
                                onChangeText={(input) => this.setState({ serviceDescription: input })}
                                value={this.state.serviceDescription}
                                maxLength={240} />
                        </View>
                    </View>
                    <View style={{ flex: 0.5 }}></View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={fontStyles.bigTextStyleBlack}>
                                {strings.Pricing}</Text>
                        </View>
                        <View style={{ flex: 1.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flex: 0.5 }}>
                                <RNPickerSelect
                                    onValueChange={(value) => this.setState({ priceType: value })}
                                    items={[
                                        { label: strings.Per, value: 'per' },
                                        { label: strings.Range, value: 'range' },
                                    ]}
                                    value={this.state.priceType}
                                    style={{
                                        iconContainer: {
                                            top: Dimensions.get('window').height * 0.014,
                                            right: Dimensions.get('window').width * 0.11
                                        },
                                        inputIOS: {
                                            borderWidth: 1,
                                            borderColor: colors.lightBlue,
                                            borderRadius: 20,
                                            width: Dimensions.get('window').width * 0.2,
                                            height: Dimensions.get('window').height * 0.05,
                                            paddingLeft: Dimensions.get('window').height * 0.01
                                        },
                                        inputAndroid: {
                                            borderWidth: 1,
                                            borderColor: colors.lightBlue,
                                            borderRadius: 20,
                                            width: Dimensions.get('window').width * 0.2,
                                            height: Dimensions.get('window').height * 0.05,
                                            paddingLeft: Dimensions.get('window').height * 0.01
                                        }
                                    }}
                                    Icon={() =>
                                        <Icon type='font-awesome' name='arrow-down' color={colors.lightBlue} size={20} />
                                    } />
                            </View>
                            {
                                this.state.priceType === 'per' ? (
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View style={{ flex: 1.4, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Text style={fontStyles.mainTextStyleBlack}>{strings.DollarSign}</Text>
                                            <Text> </Text>
                                            <OneLineRoundedBoxInput
                                                placeholder={''}
                                                onChangeText={(input) => this.setState({ pricePerNumber: input })}
                                                value={this.state.pricePerNumber}
                                                password={false}
                                                keyboardType={'numeric'}
                                                width={Dimensions.get('window').width * 0.2} />
                                        </View>
                                        <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={fontStyles.mainTextStyleBlack}>{strings.per}</Text>
                                        </View>
                                        <View style={{ flex: 1.4, alignItems: 'flex-start', justifyContent: 'center' }}>
                                            <OneLineRoundedBoxInput
                                                placeholder={strings.Hour}
                                                onChangeText={(input) => this.setState({ pricePerText: input })}
                                                value={this.state.pricePerText}
                                                password={false}
                                                width={Dimensions.get('window').width * 0.2} />
                                        </View>
                                    </View>
                                ) : (
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ flex: 1.4, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                <Text style={fontStyles.mainTextStyleBlack}>{strings.DollarSign}</Text>
                                                <Text> </Text>
                                                <OneLineRoundedBoxInput
                                                    placeholder={strings.Min}
                                                    onChangeText={(input) => this.setState({ priceMin: input })}
                                                    value={this.state.priceMin}
                                                    password={false}
                                                    keyboardType={'numeric'}
                                                    width={Dimensions.get('window').width * 0.2} />
                                            </View>
                                            <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={fontStyles.mainTextStyleBlack}>{strings.to}</Text>
                                            </View>
                                            <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={fontStyles.mainTextStyleBlack}>{strings.DollarSign}</Text>
                                                <Text> </Text>
                                                <OneLineRoundedBoxInput
                                                    placeholder={strings.Max}
                                                    onChangeText={(input) => this.setState({ priceMax: input })}
                                                    value={this.state.priceMax}
                                                    password={false}
                                                    keyboardType={'numeric'}
                                                    width={Dimensions.get('window').width * 0.2} />
                                            </View>
                                        </View>
                                    )
                            }
                        </View>
                    </View>
                    <View style={{ flex: 0.25 }}></View>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <RoundBlueButton
                                    title={this.state.serviceID ? strings.Done : strings.Create}
                                    style={roundBlueButtonStyle.MediumSizeButton}
                                    textStyle={fontStyles.bigTextStyleWhite}
                                    onPress={async () => {
                                        if (this.state.serviceID) {
                                            await this.saveProduct();
                                        } else {
                                            await this.createProduct();
                                        }
                                    }}
                                    disabled={this.state.isLoading} />
                            </View>
                            <View style={{ flex: 0.5 }}></View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <LoadingSpinner isVisible={this.state.isLoading} />
                            </View>
                        </View>

                    </View>
                    <View style={{ flex: 0.5 }}></View>
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
                    isVisible={this.state.serviceDescriptionError}
                    onPress={() => { this.setState({ serviceDescriptionError: false }) }}
                    title={strings.Whoops}
                    message={strings.PleaseEnterADescriptionWithAtLeast50Characters}
                />
                <ErrorAlert
                    isVisible={this.state.imageError}
                    onPress={() => { this.setState({ imageError: false }) }}
                    title={strings.Whoops}
                    message={strings.PleaseAddAnImage}
                />
            </HelpView >
        )
    }
}

//Exports the class
export default createProductScreen;