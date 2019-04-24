//This screen will represent the main business screen for any given provider. It will contain the
//business's profile and will be the landing screen for the user when they login. If this is the
//first time that the user logs in or if they do not yet have products, then the screen will 
//display prompting the user to sign in.
import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, TouchableOpacity, Image, FlatList } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import { connect } from 'react-redux';
import strings from 'config/strings';
import colors from 'config/colors';
import images from 'config/images/images';
import RoundBlueButton from '../../components/RoundBlueButton';
import TopBanner from '../../components/TopBanner';
import ServiceCard from '../../components/ServiceCard';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import fontStyles from 'config/styles/fontStyles';
import { BoxShadow } from 'react-native-shadow';

class businessScreen extends Component {
    render() {
        return (
            <View style={screenStyle.container}>
                <View>
                    <TopBanner title={strings.Business} />
                </View>

                <View style={{
                    flexDirection: 'row',
                    width: Dimensions.get('window').width - 40,
                    borderColor: colors.lightGray,
                    borderBottomColor: colors.black,
                    borderWidth: 0.5,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 20
                }}>

                    <View style={{ flexDirection: 'column', paddingBottom: 10 }}>
                        <Text style={[fontStyles.bigTextStyleBlack, { paddingBottom: 10 }]}>
                            {this.props.provider.companyName}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.push('ProviderEditCompanyProfileScreen', {
                                    userIndex: this.props.navigation.state.params.userIndex
                                });
                            }}>
                            <Text style={fontStyles.subTextStyleGray}>
                                {strings.EditCompanyProfile}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: 10 }}>
                        <RoundBlueButton
                            title={strings.PlusSign}
                            textStyle={fontStyles.bigTextStyleWhite}
                            style={roundBlueButtonStyle.BusinessScreenPlusButton}
                            onPress={() => {
                                this.props.navigation.push('ProviderCreateProductScreen', {
                                    userIndex: this.props.navigation.state.params.userIndex
                                })
                            }} />
                    </View>

                </View>


                {   //If the provider doesn't have products then a screen will show up asking if they
                    //want to create a product now
                    this.props.providerProducts.length === 0 ?
                        (
                            <View style={
                                {
                                    flexDirection: 'column',
                                    paddingTop: 30,
                                    alignItems: 'center'
                                }}>
                                <Text style={fontStyles.bigTextStyleBlack}>
                                    {strings.CreateYourFirstProductNowExclamation}</Text>

                                <View style={{ marginBottom: 20, marginTop: 20 }}>
                                    <BoxShadow setting={{
                                        width: 280,
                                        height: 160,
                                        color: colors.gray,
                                        border: 10,
                                        radius: 50,
                                        opacity: 0.2,
                                        x: 0,
                                        y: 5
                                    }}>
                                        <Image
                                            source={images.LawnMowing}
                                            style={{
                                                width: 280,
                                                height: 160,
                                                borderColor: colors.lightBlue,
                                                borderWidth: 6,
                                                borderRadius: 50,
                                            }} />
                                    </BoxShadow>
                                </View>

                                <RoundBlueButton
                                    title={strings.Create}
                                    style={roundBlueButtonStyle.MediumSizeButton}
                                    textStyle={fontStyles.bigTextStyleWhite}
                                    onPress={() => {
                                        this.props.navigation.push('ProviderCreateProductScreen', {
                                            userIndex: this.props.navigation.state.params.userIndex
                                        });
                                    }} />
                            </View>
                        ) : (
                            <ScrollView
                                style={{ paddingTop: 30 }}
                                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                showsVerticalScrollIndicator={false}>
                                <FlatList
                                    data={this.props.providerProducts}
                                    keyExtractor={(item, index) => {
                                        return (this.props.provider.companyName + " Product #" + index);
                                    }}
                                    renderItem={({ item, index }) => (
                                        <ServiceCard
                                            key={index}
                                            serviceTitle={item.serviceTitle}
                                            serviceDescription={item.serviceDescription}
                                            pricing={item.pricing}
                                            image={item.imageSource}
                                            numCurrentRequests={item.requests.currentRequests.length}
                                            onPress={() => {
                                                this.props.navigation.push('ProviderProductScreen', {
                                                    productID: item.serviceID
                                                });
                                            }}
                                        />
                                    )}
                                />
                                <View style={{ height: 40 }}></View>
                            </ScrollView>
                        )
                }
            </View>
        )
    }
}

//Connects this screens' props with the current user of the app
const mapStateToProps = (state, props) => {
    const provider = state.providerReducer.accounts[props.navigation.state.params.userIndex];

    //Fetches products that are offered by this specifc provider
    const providerProductIDs = provider.serviceIDs;
    const allMarketProducts = state.providerReducer.products;
    const providerProducts = [];


    providerProductIDs.forEach((id) => {
        //Finds the index of the product that is associated with the user and adds it to the array
        //of this user's products
        let indexOfProduct = allMarketProducts.findIndex((element) => {
            return element.serviceID === id;
        });

        providerProducts.push(allMarketProducts[indexOfProduct]);
    });
    return { provider, providerProducts };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(businessScreen);